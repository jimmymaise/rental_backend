import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RentingOrderModel } from './models/renting-order.model';

import { CustomAttributesService } from '@modules/custom-attributes/custom-attributes.service';

@Injectable()
export class RentingOrdersStatusService {
  constructor(
    private prismaService: PrismaService,
    private customAttributeService: CustomAttributesService,
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
      include,
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
    const updatedItem = await this.prismaService.rentingOrder.update({
      where: {
        id,
      },
      data: {
        status: newStatus,
        systemStatus: rentingOrderNewSystemStatus as any,
      },
    });

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
