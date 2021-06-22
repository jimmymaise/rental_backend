import { RefundCreateModel } from './refund-create.model';

export class RentingOrderItemRefundTransactionCreateModel extends RefundCreateModel {
  rentingOrderItemId: string;
  itemId: string;
}
