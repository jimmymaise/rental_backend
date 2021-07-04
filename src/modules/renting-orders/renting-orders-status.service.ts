import { Injectable } from '@nestjs/common';
import isEmpty from 'lodash/isEmpty';
import { RentingOrderSystemStatusType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { RentingOrderModel } from './models/renting-order.model';

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
    if (rentingOrderNewSystemStatus === RentingOrderSystemStatusType.Reserved) {
      await this.orgStatisticLogService.increaseTodayOrderAmount(
        orgId,
        updatedItem.totalAmount,
      );
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
