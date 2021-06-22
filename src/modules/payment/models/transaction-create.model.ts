import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { TransactionType } from '@prisma/client';
import { PaymentCreateModel } from './payment-create.model';
import { RefundCreateModel } from './refund-create.model';
import { RentingOrderPayTransactionCreateModel } from './renting-order-pay-transaction-create.model';
import { RentingOrderRefundTransactionCreateModel } from './renting-order-refund-transaction-create.model';
import { RentingOrderItemPayTransactionCreateModel } from './renting-order-item-pay-transaction-create.model';
import { RentingOrderItemRefundTransactionCreateModel } from './renting-order-item-refund-transaction-create.model';

export class TransactionCreateModel {
  public payAmount: number;
  public refId?: string;
  public note?: string;
  public attachedFiles?: StoragePublicDTO[];
  public method: string;
  public type: TransactionType;
  public refundToTransactionId?: string;
  public transactionOwner?: string;

  public static fromPaymentCreateModel(
    data: PaymentCreateModel,
  ): TransactionCreateModel {
    return {
      ...data,
      type: TransactionType.Pay,
    };
  }

  public static fromRefundCreateModel(
    data: RefundCreateModel,
  ): TransactionCreateModel {
    return {
      ...data,
      type: TransactionType.Refund,
    };
  }

  public static fromRentingOrderPayTransactionCreateModel(
    data: RentingOrderPayTransactionCreateModel,
  ): TransactionCreateModel {
    return {
      payAmount: data.payAmount,
      refId: data.refId,
      note: data.note,
      attachedFiles: data.attachedFiles,
      method: data.method,
      transactionOwner: data.transactionOwner,
      type: TransactionType.Pay,
    };
  }

  public static fromRentingOrderRefundTransactionCreateModel(
    data: RentingOrderRefundTransactionCreateModel,
  ): TransactionCreateModel {
    return {
      payAmount: data.payAmount,
      refId: data.refId,
      note: data.note,
      attachedFiles: data.attachedFiles,
      method: data.method,
      transactionOwner: data.transactionOwner,
      type: TransactionType.Refund,
    };
  }

  public static fromRentingOrderItemPayTransactionCreateModel(
    data: RentingOrderItemPayTransactionCreateModel,
  ): TransactionCreateModel {
    return {
      payAmount: data.payAmount,
      refId: data.refId,
      note: data.note,
      attachedFiles: data.attachedFiles,
      method: data.method,
      transactionOwner: data.transactionOwner,
      type: TransactionType.Pay,
    };
  }

  public static fromRentingOrderItemRefundTransactionCreateModel(
    data: RentingOrderItemRefundTransactionCreateModel,
  ): TransactionCreateModel {
    return {
      payAmount: data.payAmount,
      refId: data.refId,
      note: data.note,
      attachedFiles: data.attachedFiles,
      method: data.method,
      transactionOwner: data.transactionOwner,
      type: TransactionType.Refund,
    };
  }
}
