import { UserInfoDTO } from '../users/user-info.dto';

export interface MyUserContactDTO {
  userId: string;
  createdDate: number;
  userInfo: UserInfoDTO;
}
