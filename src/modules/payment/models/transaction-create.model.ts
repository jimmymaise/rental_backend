import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { TransactionType } from '@prisma/client';
import { PaymentCreateModel } from './payment-create.model';
import { RefundCreateModel } from './refund-create.model';

export class TransactionCreateModel {
  public rentingOrderId: string;
  public payAmount: number;
  public refId?: string;
  public note?: string;
  public attachedFiles?: StoragePublicDTO[];
  public method: string;
  public type: TransactionType;
  public refundToTransactionId?: string;

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
}
