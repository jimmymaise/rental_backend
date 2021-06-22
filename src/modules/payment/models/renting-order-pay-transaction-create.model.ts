import { PaymentCreateModel } from './payment-create.model';

export class RentingOrderPayTransactionCreateModel extends PaymentCreateModel {
  rentingOrderId: string;
}
