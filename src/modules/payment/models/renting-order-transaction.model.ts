import { OrgRentingOrderTransactionHistory } from '@prisma/client';

import { TransactionModel } from './transaction.model';

export class RentingOrderTransactionModel {
  orgTransactionHistoryId: string;
  orgTransactionHistory: TransactionModel;
  rentingOrderId: string;

  public static fromDatabase(
    data: OrgRentingOrderTransactionHistory,
  ): RentingOrderTransactionModel {
    return {
      rentingOrderId: data.rentingOrderId,
      orgTransactionHistoryId: data.orgTransactionHistoryId,
      orgTransactionHistory: TransactionModel.fromDatabase(
        data['orgTransactionHistory'],
      ),
    };
  }
}
