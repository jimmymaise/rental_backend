import { UserInfoDTO } from '../users/user-info.dto'

export interface MyUserContactDTO {
  id: string
  createdDate: number
  userInfo: UserInfoDTO
}
