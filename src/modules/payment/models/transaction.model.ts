import { OrgTransactionHistory } from '@prisma/client';
import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { PaymentMethodModel } from './payment-method.model';
import { RentingOrderModel } from '../../renting-orders/models/renting-order.model';
import { UserInfoDTO } from '../../users/user-info.dto';

export class TransactionModel {
  public id?: string;
  public rentingOrderId: string;
  public orgId: string;
  public payAmount: number;
  public refId?: string;
  public note?: string;
  public attachedFiles?: StoragePublicDTO[];
  public method: string;
  public createdBy: string;
  public updatedBy: string;
  public type: string;
  public refundToTransactionId?: string;

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
      rentingOrderId: data.rentingOrderId,
      orgId: data.orgId,
      payAmount: data.payAmount,
      refId: data.refId,
      note: data.note,
      attachedFiles: data.attachedFiles as StoragePublicDTO[],
      method: data.method,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      methodDetail,
      rentingOrderDetail: RentingOrderModel.fromDatabase(
        (data as any).rentingOrder,
      ),
      refundToTransactionId: data.refundToTransactionId,
      type: data.type,
      createdByDetail,
    };
  }
}

export default TransactionModel;
