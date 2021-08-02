import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { StoragesService } from '@modules/storages/storages.service';
import { RentingOrderModel } from './models/renting-order.model';
import { RentingOrderSystemStatusType } from '@app/models';
import { CustomAttributesService } from '@modules/custom-attributes/custom-attributes.service';
import { calcAmount } from '@app/helpers/order-amount-calc';
import { RentingOrderItemModel } from './models/renting-order-item.model';

interface AddItemToOrderBagModel {
  itemId: string;
  orgId: string;
  rentingOrderId?: string;
  pickupDateTime: number;
  returningDateTime: number;
  quantity?: number;
  note?: string;
}

interface AddItemToBagResult {
  isSuccess: boolean; // Mo rong them khi check duoc co lich dat thue trung. Lock san pham trong Bag khoang 15'
  rentingOrderData: RentingOrderItemModel;
}

@Injectable()
export class CustomerRentingOrdersService {
  constructor(
    private prismaService: PrismaService,
    private customAttributeService: CustomAttributesService,
    private storagesService: StoragesService,
  ) {}

  async customerAddItemToRentingOrder(
    userId: string,
    bagData: AddItemToOrderBagModel,
  ): Promise<AddItemToBagResult> {
    const DEFAULT_ITEM_QUANTITY = 1;
    let rentingOrderId = bagData.rentingOrderId;
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
      rentingOrderData: RentingOrderItemModel.fromDatabase(newRentingOrderItem),
    };
  }

  // Get List Bag
  // Convert Bag to New order
  // Remove Item from Bag
}
