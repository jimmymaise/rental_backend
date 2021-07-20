import { UserNotificationType } from '@app/models';

export interface NotificationDTO {
  id?: string;
  forUserId: string;
  data: any;
  type: UserNotificationType;
  isRead?: boolean;
  createdDate?: number;
}
