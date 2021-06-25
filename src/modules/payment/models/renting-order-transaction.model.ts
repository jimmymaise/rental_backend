import { OrgRentingOrderTransactionHistory } from '@prisma/client';

import { TransactionModel } from './transaction.model';
import { PaymentMethodModel } from './payment-method.model';
import { UserInfoDTO } from '../../users/user-info.dto';

export class RentingOrderTransactionModel {
  orgTransactionHistoryId: string;
  orgTransactionHistory: TransactionModel;
  rentingOrderId: string;

  public static fromDatabase(
    data: OrgRentingOrderTransactionHistory,
    {
      paymentMethods,
      createdByDetail,
    }: {
      paymentMethods: PaymentMethodModel[];
      createdByDetail?: UserInfoDTO;
    } = { paymentMethods: [] },
  ): RentingOrderTransactionModel {
    return {
      rentingOrderId: data.rentingOrderId,
      orgTransactionHistoryId: data.orgTransactionHistoryId,
      orgTransactionHistory: TransactionModel.fromDatabase(
        data['orgTransactionHistory'],
        {
          paymentMethods,
          createdByDetail,
        },
      ),
    };
  }
}
