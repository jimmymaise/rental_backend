import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { RentingOrderModel, AddItemToOrderBagModel } from './models';
import { RentingOrderSystemStatusType } from '@app/models';
import { CustomAttributesService } from '@modules/custom-attributes/custom-attributes.service';
import { calcAmount } from '@app/helpers/order-amount-calc';
import { RentingOrderItemModel } from './models/renting-order-item.model';
import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';
import { OffsetPaginationDTO } from '@app/models';
import { OrganizationsService } from '@modules/organizations/organizations.service';

interface AddItemToBagResult {
  isSuccess: boolean; // Mo rong them khi check duoc co lich dat thue trung. Lock san pham trong Bag khoang 15'
  rentingOrderItemData: RentingOrderItemModel;
}

@Injectable()
export class CustomerRentingOrdersService {
  constructor(
    private prismaService: PrismaService,
    private customAttributeService: CustomAttributesService,
    private organizationService: OrganizationsService,
  ) {}

  async addItemToRentingOrder(
    userId: string,
    bagData: AddItemToOrderBagModel,
  ): Promise<AddItemToBagResult> {
    const DEFAULT_ITEM_QUANTITY = 1;
    // 1 user only have 1 bag per Org
    const foundRentingOrder = await this.prismaService.rentingOrder.findFirst({
      where: {
        orgId: bagData.orgId,
        customerUserId: userId,
        systemStatus: RentingOrderSystemStatusType.InBag,
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });
    let rentingOrderId = foundRentingOrder?.id;
    const itemDetail = await this.prismaService.item.findUnique({
      where: {
        id: bagData.itemId,
      },
    });
    const rentingOrderBagStatuses =
      await this.customAttributeService.getListCustomRentingOrderStatus(
        bagData.orgId,
        RentingOrderSystemStatusType.InBag,
      );
    const defaultRentingOrderBag = rentingOrderBagStatuses[0];
    const itemRentingAmount = calcAmount({
      quantity: DEFAULT_ITEM_QUANTITY,
      rentPricePerDay: itemDetail.rentPricePerDay,
      rentPricePerWeek: itemDetail.rentPricePerWeek,
      rentPricePerMonth: itemDetail.rentPricePerMonth,
      fromDate: bagData.pickupDateTime,
      toDate: bagData.returningDateTime,
    });

    if (!rentingOrderId) {
      const rentingOrderDetail = await this.prismaService.rentingOrder.create({
        data: {
          createdBy: userId,
          status: defaultRentingOrderBag.value,
          images: itemDetail.images,
          systemStatus: RentingOrderSystemStatusType.InBag,
          updatedBy: userId,
          customerUser: {
            connect: {
              id: userId,
            },
          },
          org: {
            connect: {
              id: bagData.orgId,
            },
          },
          totalAmount: itemRentingAmount.totalAmount,
        },
        select: {
          id: true,
        },
      });
      rentingOrderId = rentingOrderDetail.id;
    }

    const newRentingOrderItem =
      await this.prismaService.rentingOrderItem.create({
        data: {
          createdBy: userId,
          name: itemDetail.name,
          images: itemDetail.images,
          status: defaultRentingOrderBag.value,
          systemStatus: RentingOrderSystemStatusType.InBag,
          updatedBy: userId,
          amount: itemRentingAmount.totalAmount,
          quantity: DEFAULT_ITEM_QUANTITY,
          customerUser: {
            connect: {
              id: userId,
            },
          },
          org: {
            connect: {
              id: bagData.orgId,
            },
          },
          item: {
            connect: {
              id: bagData.itemId,
            },
          },
          note: bagData.note,
          rentingOrder: {
            connect: {
              id: rentingOrderId,
            },
          },
          pickupDateTime: new Date(bagData.pickupDateTime),
          returningDateTime: new Date(bagData.returningDateTime),
          sku: itemDetail.sku,
          unitPrice: itemRentingAmount.fixedPrice,
          unitPricePerDay: itemRentingAmount.unitDayAmount,
          unitPricePerWeek: itemRentingAmount.unitWeekAmount,
          unitPricePerMonth: itemRentingAmount.unitMonthAmount,
        },
      });

    return {
      isSuccess: true,
      rentingOrderItemData:
        RentingOrderItemModel.fromDatabase(newRentingOrderItem),
    };
  }

  async getCustomerOrderItems({
    userId,
    offset = 0,
    pageSize = 10,
  }): Promise<OffsetPaginationDTO<RentingOrderModel>> {
    const pagingHandler = new OffsetPagingHandler(
      {
        customerUserId: userId,
        isDeleted: false,
      },
      pageSize,
      {
        updatedDate: 'desc',
      },
      this.prismaService,
      'rentingOrder',
      {
        rentingOrderItems: true,
      },
    );
    const result = await pagingHandler.getPage(offset);

    const items = [];

    for (let i = 0; i < result.items.length; i++) {
      const item = result.items[i];
      const newRentingOrderItem = RentingOrderModel.fromDatabase({
        data: item,
        rentingOrderItems: item.rentingOrderItems || [],
        rentingDepositItems: item.rentingDepositItems || [],
      });

      newRentingOrderItem.orgDetail =
        await this.organizationService.getOrgSummaryCache(
          newRentingOrderItem.orgId,
        );
      newRentingOrderItem.statusDetail =
        await this.customAttributeService.getRentingOrderStatusCustomAttributeDetail(
          newRentingOrderItem.orgId,
          newRentingOrderItem.status,
        );

      items.push(newRentingOrderItem);
    }

    return {
      ...result,
      items,
    };
  }

  async convertBagToNew({
    userId,
    rentingOrderId,
  }): Promise<RentingOrderModel> {
    const rentingOrder = await this.prismaService.rentingOrder.findUnique({
      where: {
        id: rentingOrderId,
      },
    });

    if (rentingOrder.customerUserId !== userId) {
      throw new Error('Renting order not existed');
    }

    const rentingOrderNewStatuses =
      await this.customAttributeService.getListCustomRentingOrderStatus(
        rentingOrder.orgId,
        RentingOrderSystemStatusType.New,
      );
    const newStatus = rentingOrderNewStatuses[0];

    const updatedRentingOrder = await this.prismaService.rentingOrder.update({
      where: {
        id: rentingOrderId,
      },
      data: {
        status: newStatus.value,
        systemStatus: RentingOrderSystemStatusType.New,
      },
    });

    return RentingOrderModel.fromDatabase({ data: updatedRentingOrder });
  }

  async removeItemFromBag({
    userId,
    rentingOrderItemId,
  }): Promise<RentingOrderItemModel> {
    const rentingOrderItemDetail =
      await this.prismaService.rentingOrderItem.findUnique({
        where: {
          id: rentingOrderItemId,
        },
      });

    if (
      rentingOrderItemDetail.customerUserId !== userId ||
      rentingOrderItemDetail.systemStatus !== RentingOrderSystemStatusType.InBag
    ) {
      throw new Error('Renting order item not existed');
    }

    await this.prismaService.rentingOrderItem.delete({
      where: {
        id: rentingOrderItemId,
      },
    });

    return RentingOrderItemModel.fromDatabase(rentingOrderItemDetail);
  }
}
