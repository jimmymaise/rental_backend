import { Injectable } from '@nestjs/common';
import { CommonAttributesType, PaymentMethodSystemType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  PaymentMethodModel,
  PaymentMethodCreateModel,
  PaymentCreateModel,
  PaymentModel,
} from './models';
import { PaymentMethodSystemTypeTypes } from './constants/payment-method-system-type-types';
import { CustomAttributesService } from '@modules/custom-attributes/custom-attributes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: PrismaService,
    private customAttributeService: CustomAttributesService,
    private usersService: UsersService,
  ) {}

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

  async createPayment(
    {
      rentingOrderId,
      orgId,
      payAmount,
      code,
      note,
      attachedFiles,
      method,
    }: PaymentCreateModel,
    userId: string,
    include?: any,
  ): Promise<PaymentModel> {
    const paymentMethods = await this.getAllPaymentMethods(orgId);
    const paymentMethodDetail = paymentMethods.find(
      (item) => item.value === method,
    );

    const result = await this.prismaService.orgPaymentHistory.create({
      data: {
        payAmount,
        code,
        note,
        attachedFiles,
        method,
        rentingOrder: {
          connect: {
            id: rentingOrderId,
          },
        },
        org: {
          connect: {
            id: orgId,
          },
        },
        systemMethod: paymentMethodDetail.mapWithSystemPaymentMethod
          .value as PaymentMethodSystemType,
        createdByUser: {
          connect: {
            id: userId,
          },
        },
        updatedBy: userId,
      },
      include,
    });

    const createdByDetail = await this.usersService.getUserDetailData(userId);

    return PaymentModel.fromDatabase(result, {
      paymentMethods,
      createdByDetail,
    });
  }
}
