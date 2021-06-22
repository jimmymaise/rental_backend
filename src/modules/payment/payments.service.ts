import { Injectable } from '@nestjs/common';
import { CommonAttributesType, PaymentMethodSystemType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  PaymentMethodModel,
  PaymentMethodCreateModel,
  TransactionModel,
  TransactionCreateModel,
  RentingOrderItemPayTransactionCreateModel,
  RentingOrderItemRefundTransactionCreateModel,
  RentingOrderPayTransactionCreateModel,
  RentingOrderRefundTransactionCreateModel,
  RentingOrderItemTransactionModel,
  RentingOrderTransactionModel,
} from './models';
import { PaymentMethodSystemTypeTypes } from './constants/payment-method-system-type-types';
import { UsersService } from '../users/users.service';
import { PaymentTransactionTypes } from './constants/payment-transaction-types';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: PrismaService,
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

  async createTransaction(
    {
      payAmount,
      refId,
      note,
      attachedFiles,
      method,
      type,
      refundToTransactionId,
      transactionOwner,
    }: TransactionCreateModel,
    orgId,
    userId: string,
    include?: any,
  ): Promise<TransactionModel> {
    const paymentMethods = await this.getAllPaymentMethods(orgId);
    const paymentMethodDetail = paymentMethods.find(
      (item) => item.value === method,
    );

    const result = await this.prismaService.orgTransactionHistory.create({
      data: {
        payAmount,
        refId,
        note,
        attachedFiles,
        method,
        org: {
          connect: {
            id: orgId,
          },
        },
        type,
        refundToTransactionId,
        systemMethod: paymentMethodDetail.mapWithSystemPaymentMethod
          .value as PaymentMethodSystemType,
        createdByUser: {
          connect: {
            id: userId,
          },
        },
        transactionOwnerUser: {
          connect: {
            id: transactionOwner,
          },
        },
      },
      include,
    });

    const createdByDetail = await this.usersService.getUserDetailData(userId);

    return TransactionModel.fromDatabase(result, {
      paymentMethods,
      createdByDetail,
    });
  }

  async createOrderPayTransaction(
    data: RentingOrderPayTransactionCreateModel,
    orgId: string,
    userId: string,
  ): Promise<TransactionModel> {
    const transactionHistory = await this.createTransaction(
      TransactionCreateModel.fromRentingOrderPayTransactionCreateModel(data),
      orgId,
      userId,
    );

    await this.prismaService.orgRentingOrderTransactionHistory.create({
      data: {
        orgTransactionHistory: {
          connect: {
            id: transactionHistory.id,
          },
        },
        rentingOrder: {
          connect: {
            id: data.rentingOrderId,
          },
        },
        type: PaymentTransactionTypes.PaymentForRentingOrder,
      },
    });

    await this.prismaService.rentingOrder.update({
      where: {
        id: data.rentingOrderId,
      },
      data: {
        payAmount: {
          increment: data.payAmount,
        },
      },
    });

    return transactionHistory;
  }

  async createOrderRefundTransaction(
    data: RentingOrderRefundTransactionCreateModel,
    orgId: string,
    userId: string,
  ): Promise<TransactionModel> {
    const transactionHistory = await this.createTransaction(
      TransactionCreateModel.fromRentingOrderRefundTransactionCreateModel(data),
      orgId,
      userId,
    );

    await this.prismaService.orgRentingOrderTransactionHistory.create({
      data: {
        orgTransactionHistory: {
          connect: {
            id: transactionHistory.id,
          },
        },
        rentingOrder: {
          connect: {
            id: data.rentingOrderId,
          },
        },
        type: PaymentTransactionTypes.PaymentForRentingOrder,
      },
    });

    await this.prismaService.rentingOrder.update({
      where: {
        id: data.rentingOrderId,
      },
      data: {
        payAmount: {
          decrement: data.payAmount,
        },
      },
    });

    return transactionHistory;
  }

  async createOrderItemPayDamagesTransaction(
    data: RentingOrderItemPayTransactionCreateModel,
    orgId: string,
    userId: string,
  ): Promise<TransactionModel> {
    const transactionHistory = await this.createTransaction(
      TransactionCreateModel.fromRentingOrderItemPayTransactionCreateModel(
        data,
      ),
      orgId,
      userId,
    );

    await this.prismaService.orgRentingOrderItemTransactionHistory.create({
      data: {
        orgTransactionHistory: {
          connect: {
            id: transactionHistory.id,
          },
        },
        rentingOrderItem: {
          connect: {
            id: data.rentingOrderItemId,
          },
        },
        item: {
          connect: {
            id: data.itemId,
          },
        },
        type: PaymentTransactionTypes.PaymentForDamagesOfRentingOrderItem,
      },
    });

    return transactionHistory;
  }

  async createOrderItemRefundDamagesTransaction(
    data: RentingOrderItemRefundTransactionCreateModel,
    orgId: string,
    userId: string,
  ): Promise<TransactionModel> {
    const transactionHistory = await this.createTransaction(
      TransactionCreateModel.fromRentingOrderItemRefundTransactionCreateModel(
        data,
      ),
      orgId,
      userId,
    );

    await this.prismaService.orgRentingOrderItemTransactionHistory.create({
      data: {
        orgTransactionHistory: {
          connect: {
            id: transactionHistory.id,
          },
        },
        rentingOrderItem: {
          connect: {
            id: data.rentingOrderItemId,
          },
        },
        item: {
          connect: {
            id: data.itemId,
          },
        },
        type: PaymentTransactionTypes.PaymentForDamagesOfRentingOrderItem,
      },
    });

    return transactionHistory;
  }

  async getAllPaymentTransactionForRentingOrder({
    orgId,
    rentingOrderId,
    type,
  }: {
    orgId: string;
    rentingOrderId: string;
    type?: PaymentTransactionTypes;
  }): Promise<RentingOrderTransactionModel[]> {
    const where: any = {
      rentingOrderId,
    };

    if (type) {
      where.type = type;
    }

    const result = await this.prismaService.orgRentingOrderTransactionHistory.findMany(
      {
        where,
        include: {
          orgTransactionHistory: true,
          rentingOrder: true,
        },
      },
    );

    if (result?.length && result[0].rentingOrder.orgId !== orgId) {
      throw new Error('getAllPaymentTransactionForRentingOrder not found');
    }

    return result.map((item) =>
      RentingOrderTransactionModel.fromDatabase(item),
    );
  }

  async getAllPaymentTransactionForRentingOrderItem({
    orgId,
    rentingOrderItemId,
    type,
  }: {
    orgId: string;
    rentingOrderItemId: string;
    type?: PaymentTransactionTypes;
  }): Promise<RentingOrderItemTransactionModel[]> {
    const where: any = {
      rentingOrderItemId,
    };

    if (type) {
      where.type = type;
    }

    const result = await this.prismaService.orgRentingOrderItemTransactionHistory.findMany(
      {
        where,
        include: {
          orgTransactionHistory: true,
          rentingOrderItem: true,
        },
      },
    );

    if (result?.length && result[0].rentingOrderItem.orgId !== orgId) {
      throw new Error('getAllPaymentTransactionForRentingOrderItem not found');
    }

    return result.map((item) =>
      RentingOrderItemTransactionModel.fromDatabase(item),
    );
  }
}
