export interface AddItemToOrderBagModel {
  itemId: string;
  orgId: string;
  pickupDateTime: number;
  returningDateTime: number;
  quantity?: number;
  note?: string;
}
