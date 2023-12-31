import { Injectable } from '@nestjs/common';
import isEmpty from 'lodash/isEmpty';

import { PrismaService } from '../prisma/prisma.service';
import { RentingOrderModel } from './models/renting-order.model';
import { RentingOrderSystemStatusType } from '@app/models';

import { CustomAttributesService } from '@modules/custom-attributes/custom-attributes.service';
import { OrgStatisticLogService } from '@modules/org-statistics';

@Injectable()
export class RentingOrdersStatusService {
  constructor(
    private prismaService: PrismaService,
    private customAttributeService: CustomAttributesService,
    private orgStatisticLogService: OrgStatisticLogService,
  ) {}

  public async changeRentingOrderStatus({
    id,
    orgId,
    include,
    newStatus,
  }: {
    id: string;
    orgId: string;
    include?: any;
    newStatus: string;
  }): Promise<RentingOrderModel> {
    let rentingDepositItemTypes;
    let rentingDepositItemStatuses;

    const statuses = await this.customAttributeService.getAllRentingOrderStatusCustomAttributes(
      orgId,
    );

    if (include) {
      delete include['statusDetail'];
      delete include['allowChangeToStatuses'];
    }

    if (include?.rentingDepositItem) {
      if (include?.rentingDepositItem.statusDetail) {
        rentingDepositItemStatuses = await this.customAttributeService.getAllRentingDepositItemStatusCustomAttributes(
          orgId,
        );
      }

      if (include?.rentingDepositItem.typeDetail) {
        rentingDepositItemTypes = await this.customAttributeService.getAllRentingDepositItemTypeCustomAttributes(
          orgId,
        );
      }
    }
    if (include) {
      delete include['rentingDepositItem'];
    }

    if (include) {
      delete include['rentingOrderItem'];
    }

    const item: any = await this.prismaService.rentingOrder.findUnique({
      where: { id },
      include: isEmpty(include) ? undefined : include,
    });

    if (item.orgId !== orgId) {
      throw new Error('Record not exist');
    }

    let customerInfo;
    if (include?.customerUser) {
      customerInfo = await this.prismaService.customer.findUnique({
        where: {
          userId_orgId: {
            userId: item.customerUserId,
            orgId,
          },
        },
      });
    }

    // Update
    const rentingOrderNewSystemStatus = statuses.find(
      (status) => status.value === newStatus,
    ).mapWithSystemStatus.value;
    await this.prismaService.rentingOrderItem.updateMany({
      where: {
        rentingOrderId: item.id,
      },
      data: {
        status: newStatus,
        systemStatus: rentingOrderNewSystemStatus as any,
      },
    });
    const updatedItem = await this.prismaService.rentingOrder.update({
      where: {
        id,
      },
      data: {
        status: newStatus,
        systemStatus: rentingOrderNewSystemStatus as any,
      },
    });

    // Log Statistic
    switch (rentingOrderNewSystemStatus) {
      case RentingOrderSystemStatusType.Reserved:
        await this.orgStatisticLogService.increaseNowReservedOrderCount(orgId);
        await this.orgStatisticLogService.increaseNowOrderAmount(
          orgId,
          updatedItem.totalAmount,
        );

        const rentingOrderDetailResult = await this.prismaService.rentingOrder.findUnique(
          {
            where: {
              id,
            },
            select: {
              rentingOrderItems: {
                select: {
                  amount: true,
                  item: {
                    select: {
                      id: true,
                      orgCategories: {
                        select: {
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        );
        for (
          let i = 0;
          i < rentingOrderDetailResult.rentingOrderItems.length;
          i++
        ) {
          const itemDetail = rentingOrderDetailResult.rentingOrderItems[i];

          for (let j = 0; j < itemDetail.item.orgCategories.length; j++) {
            await this.orgStatisticLogService.increaseNowOrgCategoryAmount(
              orgId,
              itemDetail.item.orgCategories[j].id,
              itemDetail.amount,
            );
          }

          await this.orgStatisticLogService.increaseNowItemAmount(
            orgId,
            itemDetail.item.id,
            itemDetail.amount,
          );
        }
        break;
      case RentingOrderSystemStatusType.PickedUp:
        await this.orgStatisticLogService.increaseNowPickedUpOrderCount(orgId);
        break;
      case RentingOrderSystemStatusType.Cancelled:
        await this.orgStatisticLogService.increaseNowCancelledOrderCount(orgId);
        const rentingOrderDetailResult2 = await this.prismaService.rentingOrder.findUnique(
          {
            where: {
              id,
            },
            select: {
              rentingOrderItems: {
                select: {
                  amount: true,
                  item: {
                    select: {
                      id: true,
                      orgCategories: {
                        select: {
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        );
        for (
          let i = 0;
          i < rentingOrderDetailResult2.rentingOrderItems.length;
          i++
        ) {
          const itemDetail = rentingOrderDetailResult2.rentingOrderItems[i];

          await this.orgStatisticLogService.increaseNowItemCancelledOrderCount(
            orgId,
            itemDetail.item.id,
          );

          for (let j = 0; j < itemDetail.item.orgCategories.length; j++) {
            await this.orgStatisticLogService.increaseNowOrgCategoryCancelledOrderCount(
              orgId,
              itemDetail.item.orgCategories[j].id,
            );
          }
        }
        break;
      case RentingOrderSystemStatusType.Returned:
        await this.orgStatisticLogService.increaseNowReturnedOrderCount(orgId);
        const rentingOrderDetailResult3 = await this.prismaService.rentingOrder.findUnique(
          {
            where: {
              id,
            },
            select: {
              rentingOrderItems: {
                select: {
                  amount: true,
                  item: {
                    select: {
                      id: true,
                      orgCategories: {
                        select: {
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        );
        for (
          let i = 0;
          i < rentingOrderDetailResult3.rentingOrderItems.length;
          i++
        ) {
          const itemDetail = rentingOrderDetailResult3.rentingOrderItems[i];

          await this.orgStatisticLogService.increaseNowItemReturnedOrderCount(
            orgId,
            itemDetail.item.id,
          );

          for (let j = 0; j < itemDetail.item.orgCategories.length; j++) {
            await this.orgStatisticLogService.increaseNowOrgCategoryReturnedOrderCount(
              orgId,
              itemDetail.item.orgCategories[j].id,
            );
          }
        }
        break;
    }

    return RentingOrderModel.fromDatabase({
      data: updatedItem,
      rentingOrderItems: item.rentingOrderItems || [],
      rentingDepositItems: item.rentingDepositItems || [],
      orgCustomerInfo: customerInfo,
      statuses,
      rentingDepositItemTypes,
      rentingDepositItemStatuses,
    });
  }
}
