import { Injectable } from '@nestjs/common';
import { CommonAttributesType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethodModel, PaymentMethodCreateModel } from './models';
import { PaymentMethodSystemTypeTypes } from './constants/payment-method-system-type-types';

@Injectable()
export class PaymentsService {
  constructor(private prismaService: PrismaService) {}

  getAllPaymentMethodSystemType(): PaymentMethodModel[] {
    return PaymentMethodSystemTypeTypes;
  }

  async getAllPaymentMethods(orgId: string): Promise<PaymentMethodModel[]> {
    const queryResult = await this.prismaService.commonAttributesConfig.findMany(
      {
        where: {
          orgId,
          type: CommonAttributesType.PaymentMethod,
        },
      },
    );

    return queryResult.map((record) =>
      PaymentMethodModel.fromCommonAttributesConfig(record),
    );
  }

  async createPaymentMethod(
    orgId: string,
    userId: string,
    data: PaymentMethodCreateModel,
  ): Promise<PaymentMethodModel> {
    const result = await this.prismaService.commonAttributesConfig.create({
      data: PaymentMethodCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
    });

    return PaymentMethodModel.fromCommonAttributesConfig(result);
  }

  async updatePaymentMethod(
    value: string,
    orgId: string,
    userId: string,
    data: PaymentMethodCreateModel,
  ): Promise<PaymentMethodModel> {
    const updatedData = PaymentMethodCreateModel.toCommonAttributesConfig(
      orgId,
      userId,
      data,
    );
    const result = await this.prismaService.commonAttributesConfig.update({
      where: {
        orgId_type_value: {
          orgId,
          value,
          type: CommonAttributesType.PaymentMethod,
        },
      },
      data: {
        label: updatedData.label,
        customConfigs: updatedData.customConfigs,
        isDisabled: updatedData.isDisabled,
        description: updatedData.description,
        mapWithSystemValue: updatedData.mapWithSystemValue,
        order: updatedData.order,
      },
    });

    return PaymentMethodModel.fromCommonAttributesConfig(result);
  }

  async deletePaymentMethod(
    value: string,
    orgId: string,
    type: string,
  ): Promise<PaymentMethodModel> {
    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        orgId_type_value: { orgId, value, type: type as CommonAttributesType },
      },
    });

    return PaymentMethodModel.fromCommonAttributesConfig(result);
  }
}
