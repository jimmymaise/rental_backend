import { Injectable } from '@nestjs/common';

import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';
import { OffsetPaginationDTO } from '@app/models';
import { PrismaService } from '../prisma/prisma.service';
import {
  RentingOrderSystemStatusType,
  RentingDepositItemSystemType,
  RentingDepositItemSystemStatusType,
  RentingOrder,
} from '@prisma/client';
import { RentingOrderModel } from './models/renting-order.model';
import { RentingOrderCreateModel } from './models/renting-order-create.model';
import { StoragesService } from '@modules/storages/storages.service';

import { CustomAttributesService } from '@modules/custom-attributes/custom-attributes.service';

@Injectable()
export class RentingOrdersService {
  constructor(
    private prismaService: PrismaService,
    private storagesService: StoragesService,
    private customAttributeService: CustomAttributesService,
  ) {}

  public async createRentingOrder({
    creatorId,
    orgId,
    data,
  }: {
    creatorId: string;
    orgId: string;
    data: RentingOrderCreateModel;
  }): Promise<RentingOrderModel> {
    // TODO: Hien tai chi support 1 SystemStatus map voi 1 Custom Status

    // ----> Create Selling Order
    // GET Order new status
    const rentingOrderNewStatuses = await this.customAttributeService.getListCustomRentingOrderStatus(
      orgId,
      RentingOrderSystemStatusType.New,
    );
    const defaultRentingOrderNew = rentingOrderNewStatuses[0];

    // Create Selling Order
    const createRentingOrderResult = await this.prismaService.rentingOrder.create(
      {
        data: {
          status: defaultRentingOrderNew.value,
          systemStatus: RentingOrderSystemStatusType.New,
          updatedBy: creatorId,
          orderCustomId: data.orderCustomId,
          attachedFiles: data.attachedFiles,
          customerUser: {
            connect: {
              id: data.customerUserId,
            },
          },
          note: data.note,
          org: {
            connect: {
              id: orgId,
            },
          },
          totalAmount: data.totalAmount,
        },
      },
    );

    // ----> Create Renting Order Item
    // GET Renting Item new status
    const createManyRentingOrderItemData = [];
    data.rentingOrderItems.forEach((rentingOrderItem) => {
      (rentingOrderItem.attachedFiles || []).forEach((file) => {
        this.storagesService.handleUploadImageBySignedUrlComplete(
          file.id,
          file.imageSizes,
          false,
        );
      });

      createManyRentingOrderItemData.push({
        customerUserId: data.customerUserId,
        name: rentingOrderItem.name,
        sku: rentingOrderItem.sku,
        note: rentingOrderItem.note,
        amount: rentingOrderItem.amount,
        quantity: rentingOrderItem.quantity,
        pickupDateTime: rentingOrderItem.pickupDateTime
          ? new Date(rentingOrderItem.pickupDateTime)
          : null,
        returningDateTime: rentingOrderItem.returningDateTime
          ? new Date(rentingOrderItem.returningDateTime)
          : null,
        unitPrice: rentingOrderItem.unitPrice,
        unitPricePerDay: rentingOrderItem.unitPricePerDay,
        unitPricePerWeek: rentingOrderItem.unitPricePerWeek,
        unitPricePerMonth: rentingOrderItem.unitPricePerMonth,
        attachedFiles: rentingOrderItem.attachedFiles,
        itemId: rentingOrderItem.itemId,
        orgId,
        rentingOrderId: createRentingOrderResult.id,
        status: defaultRentingOrderNew.value,
        systemStatus: RentingOrderSystemStatusType.New,
        updatedBy: creatorId,
      });
    });
    // Create list Renting Item in Order
    await this.prismaService.rentingOrderItem.createMany({
      data: createManyRentingOrderItemData,
    });

    // Create Deposit Item
    const depositItemStatuses = await this.customAttributeService.getListCustomRentingDepositItemStatus(
      orgId,
      RentingDepositItemSystemStatusType.New,
    );
    const defaultDepositItemStatus = depositItemStatuses[0];
    const depositItemTypes = await this.customAttributeService.getListCustomRentingDepositItemType(
      orgId,
    );

    const createRentingDepositItemsManyData = [];
    data.rentingDepositItems.forEach((depositItem) => {
      (depositItem.attachedFiles || []).forEach((file) => {
        this.storagesService.handleUploadImageBySignedUrlComplete(
          file.id,
          file.imageSizes,
          false,
        );
      });

      const depositItemTypeDetail = depositItemTypes.find(
        (typeItem) => typeItem.value === depositItem.type,
      );

      createRentingDepositItemsManyData.push({
        customerUserId: data.customerUserId,
        orgId,
        status: defaultDepositItemStatus.value,
        systemStatus: RentingDepositItemSystemStatusType.New,
        systemType: depositItemTypeDetail.mapWithSystemType
          .value as RentingDepositItemSystemType,
        type: depositItem.type,
        attachedFiles: depositItem.attachedFiles,
        rentingOrderId: createRentingOrderResult.id,
        note: depositItem.note,
      });
    });
    await this.prismaService.rentingDepositItem.createMany({
      data: createRentingDepositItemsManyData,
    });

    return RentingOrderModel.fromDatabase({ data: createRentingOrderResult });
  }

  public async getRentingOrdersWithOffsetPaging(
    whereQuery: any,
    pageSize: number,
    offset?: any,
    orderBy: any = { id: 'desc' },
    include?: any,
  ): Promise<OffsetPaginationDTO<RentingOrderModel>> {
    let statuses;

    if (include.statusDetail) {
      statuses = await this.customAttributeService.getAllRentingOrderStatusCustomAttributes(
        whereQuery.orgId,
      );
    }
    delete include['statusDetail'];

    const pagingHandler = new OffsetPagingHandler(
      whereQuery,
      pageSize,
      orderBy,
      this.prismaService,
      'rentingOrder',
      include,
    );
    const result = await pagingHandler.getPage(offset);

    const items = [];
    const tmpCachedCustomer = {};

    for (let i = 0; i < result.items.length; i++) {
      const item = result.items[i];
      let customerInfo = tmpCachedCustomer[item.customerUserId];
      if (include.customerUser && !customerInfo) {
        customerInfo = await this.prismaService.customer.findUnique({
          where: {
            userId_orgId: {
              userId: item.customerUserId,
              orgId: whereQuery.orgId,
            },
          },
        });

        tmpCachedCustomer[item.customerUserId] = customerInfo;
      }

      items.push(
        RentingOrderModel.fromDatabase({
          data: item,
          rentingOrderItems: item.rentingOrderItems || [],
          rentingDepositItems: item.rentingDepositItems || [],
          orgCustomerInfo: customerInfo,
          statuses,
        }),
      );
    }

    return {
      ...result,
      items,
    };
  }

  public async getRentingOrdersByOrgIdWithOffsetPaging(
    orgId,
    pageSize: number,
    offset?: any,
    orderBy?: any,
    include?: any,
  ): Promise<OffsetPaginationDTO<RentingOrderModel>> {
    const whereQuery = {
      orgId: orgId,
    };

    return this.getRentingOrdersWithOffsetPaging(
      whereQuery,
      pageSize,
      offset,
      orderBy,
      include,
    );
  }

  public async getOrderDetail(
    id: string,
    orgId: string,
    include?: any,
  ): Promise<RentingOrderModel> {
    let statuses;
    let rentingDepositItemTypes;
    let rentingDepositItemStatuses;

    if (
      include.statusDetail ||
      include.allowChangeToStatuses ||
      include.rentingOrderItem?.statusDetail
    ) {
      statuses = await this.customAttributeService.getAllRentingOrderStatusCustomAttributes(
        orgId,
      );
    }

    if (include) {
      delete include['statusDetail'];
      delete include['allowChangeToStatuses'];
      delete include['rentingOrderItem'];
    }

    if (include.rentingDepositItem) {
      if (include.rentingDepositItem.statusDetail) {
        rentingDepositItemStatuses = await this.customAttributeService.getAllRentingDepositItemStatusCustomAttributes(
          orgId,
        );
      }

      if (include.rentingDepositItem.typeDetail) {
        rentingDepositItemTypes = await this.customAttributeService.getAllRentingDepositItemTypeCustomAttributes(
          orgId,
        );
      }
    }
    delete include['rentingDepositItem'];

    const item: any = await this.prismaService.rentingOrder.findUnique({
      where: { id },
      include,
    });

    if (item.orgId !== orgId) {
      throw new Error('Record not exist');
    }

    let customerInfo;
    if (include.customerUser) {
      customerInfo = await this.prismaService.customer.findUnique({
        where: {
          userId_orgId: {
            userId: item.customerUserId,
            orgId,
          },
        },
      });
    }

    return RentingOrderModel.fromDatabase({
      data: item,
      rentingOrderItems: item.rentingOrderItems || [],
      rentingDepositItems: item.rentingDepositItems || [],
      orgCustomerInfo: customerInfo,
      statuses,
      rentingDepositItemTypes,
      rentingDepositItemStatuses,
    });
  }

  public async updateRentingOrder({
    creatorId,
    id,
    orgId,
    data,
  }: {
    creatorId: string;
    id: string;
    orgId: string;
    data: RentingOrderModel;
  }): Promise<RentingOrderModel> {
    const item: RentingOrder = await this.prismaService.rentingOrder.findUnique(
      {
        where: { id },
      },
    );

    if (item.orgId !== orgId) {
      throw new Error('Record not exist');
    }

    if (item.systemStatus !== RentingOrderSystemStatusType.New) {
      throw new Error('not allow to update the in-progress order');
    }

    // TODO: use redis cache for caching custom renting order status
    const rentingOrderNewStatuses = await this.customAttributeService.getListCustomRentingOrderStatus(
      orgId,
      RentingOrderSystemStatusType.New,
    );
    const defaultRentingOrderNew = rentingOrderNewStatuses[0];

    // Update Renting Order
    const updateRentingOrderResult = await this.prismaService.rentingOrder.update(
      {
        data: {
          updatedBy: creatorId,
          orderCustomId: data.orderCustomId,
          attachedFiles: data.attachedFiles,
          customerUserId: {
            set: data.customerUserId,
          },
          note: data.note,
          totalAmount: data.totalAmount,
        },
        where: {
          id,
        },
        include: {
          rentingOrderItems: true,
          rentingDepositItems: true,
        },
      },
    );

    // Update Renting Order Item
    const createManyRentingOrderItemData = [];
    const updateManyRentingOrderItemData = [];
    const existingUpdateRentingOrderItemIds = [];
    data.rentingOrderItems.forEach((updatingRentingOrderItem) => {
      (updatingRentingOrderItem.attachedFiles || []).forEach((file) => {
        this.storagesService.handleUploadImageBySignedUrlComplete(
          file.id,
          file.imageSizes,
          false,
        );
      });

      if (updatingRentingOrderItem.id) {
        existingUpdateRentingOrderItemIds.push(id);
        updateManyRentingOrderItemData.push({
          id: updatingRentingOrderItem.id,
          customerUserId: {
            set: data.customerUserId,
          },
          name: updatingRentingOrderItem.name,
          sku: updatingRentingOrderItem.sku,
          note: updatingRentingOrderItem.note,
          amount: updatingRentingOrderItem.amount,
          quantity: updatingRentingOrderItem.quantity,
          pickupDateTime: updatingRentingOrderItem.pickupDateTime
            ? new Date(updatingRentingOrderItem.pickupDateTime)
            : null,
          returningDateTime: updatingRentingOrderItem.returningDateTime
            ? new Date(updatingRentingOrderItem.returningDateTime)
            : null,
          unitPrice: updatingRentingOrderItem.unitPrice,
          unitPricePerDay: updatingRentingOrderItem.unitPricePerDay,
          unitPricePerWeek: updatingRentingOrderItem.unitPricePerWeek,
          unitPricePerMonth: updatingRentingOrderItem.unitPricePerMonth,
          attachedFiles: updatingRentingOrderItem.attachedFiles,
          itemId: updatingRentingOrderItem.itemId,
          updatedBy: creatorId,
        });
      } else {
        createManyRentingOrderItemData.push({
          customerUserId: data.customerUserId,
          name: updatingRentingOrderItem.name,
          sku: updatingRentingOrderItem.sku,
          note: updatingRentingOrderItem.note,
          amount: updatingRentingOrderItem.amount,
          quantity: updatingRentingOrderItem.quantity,
          pickupDateTime: updatingRentingOrderItem.pickupDateTime
            ? new Date(updatingRentingOrderItem.pickupDateTime)
            : null,
          returningDateTime: updatingRentingOrderItem.returningDateTime
            ? new Date(updatingRentingOrderItem.returningDateTime)
            : null,
          unitPrice: updatingRentingOrderItem.unitPrice,
          unitPricePerDay: updatingRentingOrderItem.unitPricePerDay,
          unitPricePerWeek: updatingRentingOrderItem.unitPricePerWeek,
          unitPricePerMonth: updatingRentingOrderItem.unitPricePerMonth,
          attachedFiles: updatingRentingOrderItem.attachedFiles,
          itemId: updatingRentingOrderItem.itemId,
          orgId,
          rentingOrderId: updateRentingOrderResult.id,
          status: defaultRentingOrderNew.value,
          systemStatus: RentingOrderSystemStatusType.New,
          updatedBy: creatorId,
        });
      }
    });

    await this.prismaService.rentingOrderItem.deleteMany({
      where: {
        id: {
          notIn: existingUpdateRentingOrderItemIds,
        },
        orgId,
        rentingOrderId: updateRentingOrderResult.id,
      },
    });

    await this.prismaService.rentingOrderItem.createMany({
      data: createManyRentingOrderItemData,
    });

    updateManyRentingOrderItemData.forEach(async (updatingRentingOrderItem) => {
      await this.prismaService.rentingOrderItem.update({
        data: updatingRentingOrderItem,
        where: {
          id: updatingRentingOrderItem.id,
        },
      });
    });

    // Update Renting Deposit Item
    const depositItemStatuses = await this.customAttributeService.getListCustomRentingDepositItemStatus(
      orgId,
      RentingDepositItemSystemStatusType.New,
    );
    const defaultDepositItemStatus = depositItemStatuses[0];
    const depositItemTypes = await this.customAttributeService.getListCustomRentingDepositItemType(
      orgId,
    );
    const createManyRentingDepositItemData = [];
    const updateManyRentingDepositItemData = [];
    const existingUpdateRentingDepositItemIds = [];
    data.rentingDepositItems.forEach((updatingRentingDepositItem) => {
      (updatingRentingDepositItem.attachedFiles || []).forEach((file) => {
        this.storagesService.handleUploadImageBySignedUrlComplete(
          file.id,
          file.imageSizes,
          false,
        );
      });

      const depositItemTypeDetail = depositItemTypes.find(
        (typeItem) => typeItem.value === updatingRentingDepositItem.type,
      );

      if (updatingRentingDepositItem.id) {
        existingUpdateRentingDepositItemIds.push(id);
        updateManyRentingDepositItemData.push({
          customerUserId: {
            set: data.customerUserId,
          },
          systemType: depositItemTypeDetail.mapWithSystemType
            .value as RentingDepositItemSystemType,
          type: updatingRentingDepositItem.type,
          attachedFiles: updatingRentingDepositItem.attachedFiles,
          note: updatingRentingDepositItem.note,
        });
      } else {
        createManyRentingDepositItemData.push({
          customerUserId: data.customerUserId,
          orgId,
          status: defaultDepositItemStatus.value,
          systemStatus: RentingDepositItemSystemStatusType.New,
          systemType: depositItemTypeDetail.mapWithSystemType
            .value as RentingDepositItemSystemType,
          type: updatingRentingDepositItem.type,
          attachedFiles: updatingRentingDepositItem.attachedFiles,
          rentingOrderId: updateRentingOrderResult.id,
          note: updatingRentingDepositItem.note,
        });
      }
    });

    await this.prismaService.rentingDepositItem.deleteMany({
      where: {
        id: {
          notIn: existingUpdateRentingDepositItemIds,
        },
        orgId,
        rentingOrderId: updateRentingOrderResult.id,
      },
    });

    await this.prismaService.rentingDepositItem.createMany({
      data: createManyRentingDepositItemData,
    });

    updateManyRentingDepositItemData.forEach(
      async (updatingRentingDepositItem) => {
        await this.prismaService.rentingDepositItem.update({
          data: updatingRentingDepositItem,
          where: {
            id: updatingRentingDepositItem.id,
          },
        });
      },
    );

    return RentingOrderModel.fromDatabase({ data: updateRentingOrderResult });
  }

  public async deleteRentingOrder({
    id,
    orgId,
  }: {
    id: string;
    orgId: string;
  }): Promise<RentingOrderModel> {
    const item: RentingOrder = await this.prismaService.rentingOrder.findUnique(
      {
        where: { id },
      },
    );

    if (item.orgId !== orgId) {
      throw new Error('Record not exist');
    }

    const deletedItem = await this.prismaService.rentingOrder.delete({
      where: {
        id,
      },
    });

    return RentingOrderModel.fromDatabase({ data: deletedItem });
  }
}
