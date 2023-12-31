import { UserNotificationType } from '@app/models';

export const RENTING_REQUEST_TYPE_SET = new Set([
  UserNotificationType.RentingRequestIsCreated,
  UserNotificationType.RentingRequestIsApproved,
  UserNotificationType.RentingRequestIsCancelled,
  UserNotificationType.RentingRequestIsCompleted,
  UserNotificationType.RentingRequestIsDeclined,
  UserNotificationType.RentingRequestIsInProgress,
]);
