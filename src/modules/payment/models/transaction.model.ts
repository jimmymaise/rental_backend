import { OrgTransactionHistory } from '@prisma/client';
import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { PaymentMethodModel } from './payment-method.model';
import { RentingOrderModel } from '../../renting-orders/models/renting-order.model';
import { UserInfoDTO } from '../../users/user-info.dto';

export class TransactionModel {
  public id?: string;
  public orgId: string;
  public payAmount: number;
  public refId?: string;
  public note?: string;
  public attachedFiles?: StoragePublicDTO[];
  public method: string;
  public createdBy: string;
  public type: string;
  public refundToTransactionId?: string;
  public transactionOwner?: string;
  public createdDate: number;

  public methodDetail?: PaymentMethodModel;
  public rentingOrderDetail?: RentingOrderModel;
  public createdByDetail?: UserInfoDTO;

  public static fromDatabase(
    data: OrgTransactionHistory,
    {
      paymentMethods,
      createdByDetail,
    }: {
      paymentMethods: PaymentMethodModel[];
      createdByDetail?: UserInfoDTO;
    } = { paymentMethods: [] },
  ): TransactionModel {
    let methodDetail: PaymentMethodModel;

    if (paymentMethods?.length) {
      methodDetail = paymentMethods.find((item) => item.value === data.method);
    }

    return {
      id: data.id,
      orgId: data.orgId,
      payAmount: data.payAmount,
      refId: data.refId,
      note: data.note,
      attachedFiles: data.attachedFiles as StoragePublicDTO[],
      method: data.method,
      createdBy: data.createdBy,
      methodDetail,
      rentingOrderDetail: (data as any).rentingOrder
        ? RentingOrderModel.fromDatabase((data as any).rentingOrder)
        : null,
      refundToTransactionId: data.refundToTransactionId,
      type: data.type,
      createdByDetail,
      transactionOwner: data.transactionOwner,
      createdDate: data.createdDate.getTime(),
    };
  }
}

export default TransactionModel;
