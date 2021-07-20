export enum ItemStatus {
  Draft = 'Draft',
  Blocked = 'Blocked',
  Published = 'Published',
}

export enum FileUsingLocate {
  ItemPreviewImage = 'ItemPreviewImage',
  UserAvatarImage = 'UserAvatarImage',
  UserCoverImage = 'UserCoverImage',
  OrgAvatarImage = 'OrgAvatarImage',
  RentingOrderItemAttachFile = 'RentingOrderItemAttachFile',
  RentingDepositItemAttachFile = 'RentingDepositItemAttachFile',
  RentingOrderActivityImage = 'RentingOrderActivityImage',
  BookingActivityImage = 'BookingActivityImage',
  PaymentTransactionImage = 'PaymentTransactionImage',
  RefundTransactionImage = 'RefundTransactionImage',
}

export enum RentingItemRequestStatus {
  New = 'New',
  Declined = 'Declined',
  Approved = 'Approved',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum RentingItemRequestActivityType {
  Comment = 'Comment',
  Declined = 'Declined',
  Approved = 'Approved',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum UserNotificationType {
  RentingRequestIsCreated = 'RentingRequestIsCreated',
  RentingRequestIsDeclined = 'RentingRequestIsDeclined',
  RentingRequestIsApproved = 'RentingRequestIsApproved',
  RentingRequestIsInProgress = 'RentingRequestIsInProgress',
  RentingRequestIsCompleted = 'RentingRequestIsCompleted',
  RentingRequestIsCancelled = 'RentingRequestIsCancelled',
}

export enum RentingOrderSystemStatusType {
  InBag = 'InBag',
  New = 'New',
  Reserved = 'Reserved',
  PickedUp = 'PickedUp',
  Returned = 'Returned',
  Cancelled = 'Cancelled',
}

export enum RentingDepositItemSystemStatusType {
  New = 'New',
  PickedUp = 'PickedUp',
  Returned = 'Returned',
}

export enum RentingDepositItemSystemType {
  Money = 'Money',
  Document = 'Document',
  Item = 'Item',
  Other = 'Other',
}

export enum CommonAttributesType {
  RentingOrderStatus = 'RentingOrderStatus',
  RentingOrderItemStatus = 'RentingOrderItemStatus',
  RentingDepositItemStatus = 'RentingDepositItemStatus',
  RentingDepositItemType = 'RentingDepositItemType',
  PaymentMethod = 'PaymentMethod',
}

export enum PaymentMethodSystemType {
  PromoCode = 'PromoCode',
  RewardPoints = 'RewardPoints',
  BankTransfer = 'BankTransfer',
  Card = 'Card',
  Cash = 'Cash',
  MobileMoney = 'MobileMoney',
  Other = 'Other',
}

export enum TransactionType {
  Pay = 'Pay',
  Refund = 'Refund',
}
