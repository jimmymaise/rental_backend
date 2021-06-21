import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';

import { PaymentsService } from './payments.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import {
  PaymentMethodCreateModel,
  PaymentMethodModel,
  RefundCreateModel,
  PaymentCreateModel,
  TransactionModel,
  TransactionCreateModel,
} from './models';

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
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_PAYMENT_TRANSACTION)
  @UseGuards(GqlAuthGuard)
  async createPayment(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: PaymentCreateModel,
  ): Promise<TransactionModel> {
    return this.paymentsService.createTransaction(
      TransactionCreateModel.fromPaymentCreateModel(data),
      user.currentOrgId,
      user.userId,
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
      type,
    );
  }
}
