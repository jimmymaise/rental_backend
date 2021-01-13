export interface RequestDataNotificationModel {
  id: string;
  itemId: string;
  itemName: string;
  ownerRequestId: string;
  lenderRequestId: string;
  fromDate?: number;
  toDate?: number;
}
