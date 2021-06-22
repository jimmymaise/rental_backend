import { OrgRentingOrderItemTransactionHistory } from '@prisma/client';

import { TransactionModel } from './transaction.model';

export class RentingOrderItemTransactionModel {
  orgTransactionHistoryId: string;
  orgTransactionHistory: TransactionModel;
  rentingOrderItemId: string;
  itemId: string;

  public static fromDatabase(
    data: OrgRentingOrderItemTransactionHistory,
  ): RentingOrderItemTransactionModel {
    return {
      rentingOrderItemId: data.rentingOrderItemId,
      itemId: data.itemId,
      orgTransactionHistoryId: data.orgTransactionHistoryId,
      orgTransactionHistory: TransactionModel.fromDatabase(
        data['orgTransactionHistory'],
      ),
    };
  }
}
