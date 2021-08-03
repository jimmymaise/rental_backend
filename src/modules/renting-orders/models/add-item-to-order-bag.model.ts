export interface AddItemToOrderBagModel {
  itemId: string;
  orgId: string;
  rentingOrderId?: string;
  pickupDateTime: number;
  returningDateTime: number;
  quantity?: number;
  note?: string;
}
