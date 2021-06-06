import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SellingOrderModel } from './models/selling-order.model';

import { CustomAttributesService } from '@modules/custom-attributes/custom-attributes.service';
import { SellingOrderStatusModel } from '../custom-attributes/models';
import { SellingOrderSystemStatusTypesMap } from '../custom-attributes/constants/selling-order-system-status-types';

@Injectable()
export class SellingOrdersStatusService {
  constructor(
    private prismaService: PrismaService,
    private customAttributeService: CustomAttributesService,
  ) {}

  public async changeSellingOrderStatus({
    id,
    orgId,
    include,
    newStatus,
  }: {
    id: string;
    orgId: string;
    include?: any;
    newStatus: string;
  }): Promise<SellingOrderModel> {
    let rentingOrderItemStatuses;
    let rentingDepositItemTypes;
    let rentingDepositItemStatuses;

    const statuses = await this.customAttributeService.getAllSellingOrderStatusCustomAttributes(
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

    if (include?.rentingOrderItem) {
      if (include?.rentingOrderItem.statusDetail) {
        rentingOrderItemStatuses = await this.customAttributeService.getAllRentingOrderItemStatusCustomAttributes(
          orgId,
        );
      }
    }
    if (include) {
      delete include['rentingOrderItem'];
    }

    const item: any = await this.prismaService.sellingOrder.findUnique({
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
    const sellingOrderNewSystemStatus = statuses.find(
      (status) => status.value === newStatus,
    ).mapWithSystemStatus.value;
    const updatedItem = await this.prismaService.sellingOrder.update({
      where: {
        id,
      },
      data: {
        status: newStatus,
        systemStatus: sellingOrderNewSystemStatus as any,
      },
    });

    return SellingOrderModel.fromDatabase({
      data: updatedItem,
      rentingOrderItems: item.rentingOrderItems || [],
      rentingDepositItems: item.rentingDepositItems || [],
      orgCustomerInfo: customerInfo,
      statuses,
      rentingOrderItemStatuses,
      rentingDepositItemTypes,
      rentingDepositItemStatuses,
    });
  }
}
