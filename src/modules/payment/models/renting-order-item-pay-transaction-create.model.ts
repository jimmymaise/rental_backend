import { PaymentCreateModel } from './payment-create.model';

export class RentingOrderItemPayTransactionCreateModel extends PaymentCreateModel {
  rentingOrderItemId: string;
  itemId: string;
}
