import { UserInfoDTO } from '../users/user-info.dto';

export interface ChatConversationDTO {
  id: string;
  members: UserInfoDTO[];
}
