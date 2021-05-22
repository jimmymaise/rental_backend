import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
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
    private commonAttributeService: CustomAttributesService,
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
    const sellingOrderNewStatuses = await this.commonAttributeService.getListCustomSellingOrderStatus(
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
    const rentingItemNewStatuses = await this.commonAttributeService.getListCustomRentingOrderItemStatus(
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
        pickupDataTime: rentingOrderItem.pickupDateTime
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
    const depositItemStatuses = await this.commonAttributeService.getListCustomRentingDepositItemStatus(
      orgId,
      RentingDepositItemSystemStatusType.New,
    );
    const defaultDepositItemStatus = depositItemStatuses[0];
    const depositItemTypes = await this.commonAttributeService.getListCustomRentingDepositItemType(
      orgId,
    );
    this.prismaService.rentingDepositItem.createMany({
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

    return SellingOrderModel.fromDatabase(createSellingOrderResult, [], []);
  }
}
