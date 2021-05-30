import { Injectable } from '@nestjs/common';

import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';
import { OffsetPaginationDTO } from '@app/models';
import { PrismaService } from '../prisma/prisma.service';
import {
  SellingOrder,
  SellingOrderSystemStatusType,
  RentingDepositItemSystemType,
  RentingDepositItemSystemStatusType,
  RentingOrderItemStatusType,
} from '@prisma/client';
import { SellingOrderModel } from './models/selling-order.model';
import { SellingOrderCreateModel } from './models/selling-order-create.model';

import { CustomAttributesService } from '@modules/custom-attributes/custom-attributes.service';

@Injectable()
export class SellingOrdersService {
  constructor(
    private prismaService: PrismaService,
    private customAttributeService: CustomAttributesService,
  ) {}

  public async createRentingOrder({
    creatorId,
    orgId,
    data,
  }: {
    creatorId: string;
    orgId: string;
    data: SellingOrderCreateModel;
  }): Promise<SellingOrderModel> {
    // TODO: Hien tai chi support 1 SystemStatus map voi 1 Custom Status

    // ----> Create Selling Order
    // GET Order new status
    const sellingOrderNewStatuses = await this.customAttributeService.getListCustomSellingOrderStatus(
      orgId,
      SellingOrderSystemStatusType.New,
    );
    const defaultSellingOrderNew = sellingOrderNewStatuses[0];

    // Create Selling Order
    const createSellingOrderResult = await this.prismaService.sellingOrder.create(
      {
        data: {
          status: defaultSellingOrderNew.value,
          systemStatus: SellingOrderSystemStatusType.New,
          updatedBy: creatorId,
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
    const rentingItemNewStatuses = await this.customAttributeService.getListCustomRentingOrderItemStatus(
      orgId,
      RentingOrderItemStatusType.New,
    );
    const defaultRentingItemNew = rentingItemNewStatuses[0];
    // Create list Renting Item in Order
    await this.prismaService.rentingOrderItem.createMany({
      data: data.rentingOrderItems.map((rentingOrderItem) => ({
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
        sellingOrderId: createSellingOrderResult.id,
        status: defaultRentingItemNew.value,
        systemStatus: RentingOrderItemStatusType.New,
        updatedBy: creatorId,
      })),
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
    await this.prismaService.rentingDepositItem.createMany({
      data: data.rentingDepositItems.map((depositItem) => {
        const depositItemTypeDetail = depositItemTypes.find(
          (typeItem) => typeItem.value === depositItem.type,
        );

        return {
          customerUserId: data.customerUserId,
          orgId,
          status: defaultDepositItemStatus.value,
          systemStatus: RentingDepositItemSystemStatusType.New,
          systemType: depositItemTypeDetail.mapWithSystemType
            .value as RentingDepositItemSystemType,
          type: depositItem.type,
          attachedFiles: depositItem.attachedFiles,
          sellingOrderId: createSellingOrderResult.id,
        };
      }),
    });

    return SellingOrderModel.fromDatabase({ data: createSellingOrderResult });
  }

  public async getSellingOrdersWithOffsetPaging(
    whereQuery: any,
    pageSize: number,
    offset?: any,
    orderBy: any = { id: 'desc' },
    include?: any,
  ): Promise<OffsetPaginationDTO<SellingOrderModel>> {
    let statuses;

    if (include.statusDetail) {
      statuses = await this.customAttributeService.getAllSellingOrderStatusCustomAttributes(
        whereQuery.orgId,
      );
    }
    delete include['statusDetail'];

    const pagingHandler = new OffsetPagingHandler(
      whereQuery,
      pageSize,
      orderBy,
      this.prismaService,
      'sellingOrder',
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
        SellingOrderModel.fromDatabase({
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

  public async getSellingOrdersByOrgIdWithOffsetPaging(
    orgId,
    pageSize: number,
    offset?: any,
    orderBy?: any,
    include?: any,
  ): Promise<OffsetPaginationDTO<SellingOrderModel>> {
    const whereQuery = {
      orgId: orgId,
    };

    return this.getSellingOrdersWithOffsetPaging(
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
  ): Promise<SellingOrderModel> {
    let statuses;
    if (include.statusDetail) {
      statuses = await this.customAttributeService.getAllSellingOrderStatusCustomAttributes(
        orgId,
      );
    }

    delete include['statusDetail'];
    const item: any = await this.prismaService.sellingOrder.findUnique({
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

    return SellingOrderModel.fromDatabase({
      data: item,
      rentingOrderItems: item.rentingOrderItems || [],
      rentingDepositItems: item.rentingDepositItems || [],
      orgCustomerInfo: customerInfo,
      statuses,
    });
  }
}
