import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';

import { PaymentsService } from './payments.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import {
  PaymentMethodCreateModel,
  PaymentMethodModel,
  TransactionModel,
  RentingOrderItemPayTransactionCreateModel,
  RentingOrderItemRefundTransactionCreateModel,
  RentingOrderPayTransactionCreateModel,
  RentingOrderRefundTransactionCreateModel,
  RentingOrderTransactionModel,
  RentingOrderItemTransactionModel,
} from './models';
import { PaymentTransactionTypes } from './constants/payment-transaction-types';

@Resolver('Payment')
export class PaymentsResolvers {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_PAYMENT_METHOD)
  @UseGuards(GqlAuthGuard)
  async feedAllPaymentMethods(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<PaymentMethodModel[]> {
    return this.paymentsService.getAllPaymentMethods(user.currentOrgId);
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_PAYMENT_METHOD)
  @UseGuards(GqlAuthGuard)
  async feedAllAvailablePaymentMethods(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<PaymentMethodModel[]> {
    return this.paymentsService.getAllAvailablePaymentMethods(
      user.currentOrgId,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_PAYMENT_METHOD)
  @UseGuards(GqlAuthGuard)
  async feedAllSystemPaymentMethods(): Promise<PaymentMethodModel[]> {
    return this.paymentsService.getAllPaymentMethodSystemType();
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_ORG_PAYMENT_METHOD)
  @UseGuards(GqlAuthGuard)
  async createPaymentMethod(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: PaymentMethodCreateModel,
  ): Promise<PaymentMethodModel> {
    return this.paymentsService.createPaymentMethod(
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_ORG_PAYMENT_METHOD)
  @UseGuards(GqlAuthGuard)
  async updatePaymentMethod(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('data') data: PaymentMethodCreateModel,
  ): Promise<PaymentMethodModel> {
    return this.paymentsService.updatePaymentMethod(
      value,
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER)
  @UseGuards(GqlAuthGuard)
  async deletePaymentMethod(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<PaymentMethodModel> {
    return this.paymentsService.deletePaymentMethod(
      value,
      user.currentOrgId,
      user.id,
      type,
    );
  }

  // Payment
  @Mutation()
  @Permissions(
    Permission.ORG_MASTER,
    Permission.CREATE_PAYMENT_TRANSACTION_HISTORY,
  )
  @UseGuards(GqlAuthGuard)
  async createOrderPaymentTransaction(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: RentingOrderPayTransactionCreateModel,
  ): Promise<TransactionModel> {
    return this.paymentsService.createOrderPayTransaction(
      data,
      user.currentOrgId,
      user.userId,
    );
  }

  @Mutation()
  @Permissions(
    Permission.ORG_MASTER,
    Permission.CREATE_PAYMENT_TRANSACTION_HISTORY,
  )
  @UseGuards(GqlAuthGuard)
  async createOrderRefundTransaction(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: RentingOrderRefundTransactionCreateModel,
  ): Promise<TransactionModel> {
    return this.paymentsService.createOrderRefundTransaction(
      data,
      user.currentOrgId,
      user.userId,
    );
  }

  @Mutation()
  @Permissions(
    Permission.ORG_MASTER,
    Permission.CREATE_PAYMENT_TRANSACTION_HISTORY,
  )
  @UseGuards(GqlAuthGuard)
  async createOrderItemPayDamagesTransaction(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: RentingOrderItemPayTransactionCreateModel,
  ): Promise<TransactionModel> {
    return this.paymentsService.createOrderItemPayDamagesTransaction(
      data,
      user.currentOrgId,
      user.userId,
    );
  }

  @Mutation()
  @Permissions(
    Permission.ORG_MASTER,
    Permission.CREATE_PAYMENT_TRANSACTION_HISTORY,
  )
  @UseGuards(GqlAuthGuard)
  async createOrderItemRefundDamagesTransaction(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: RentingOrderItemRefundTransactionCreateModel,
  ): Promise<TransactionModel> {
    return this.paymentsService.createOrderItemRefundDamagesTransaction(
      data,
      user.currentOrgId,
      user.userId,
    );
  }

  @Query()
  @Permissions(
    Permission.ORG_MASTER,
    Permission.GET_PAYMENT_TRANSACTION_HISTORY,
  )
  @UseGuards(GqlAuthGuard)
  async feedAllRentingOrderTransactions(
    @CurrentUser() user: GuardUserPayload,
    @Args('rentingOrderId') rentingOrderId: string,
    @Args('type') type: string,
  ): Promise<RentingOrderTransactionModel[]> {
    return this.paymentsService.getAllPaymentTransactionForRentingOrder({
      orgId: user.currentOrgId,
      rentingOrderId: rentingOrderId,
      type: type as PaymentTransactionTypes,
    });
  }

  @Query()
  @Permissions(
    Permission.ORG_MASTER,
    Permission.GET_PAYMENT_TRANSACTION_HISTORY,
  )
  @UseGuards(GqlAuthGuard)
  async feedAllRentingOrderItemTransactions(
    @CurrentUser() user: GuardUserPayload,
    @Args('rentingOrderItemId') rentingOrderItemId: string,
    @Args('type') type: string,
  ): Promise<RentingOrderItemTransactionModel[]> {
    return this.paymentsService.getAllPaymentTransactionForRentingOrderItem({
      orgId: user.currentOrgId,
      rentingOrderItemId,
      type: type as PaymentTransactionTypes,
    });
  }
}
