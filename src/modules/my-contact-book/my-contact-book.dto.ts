import { UserInfoDTO } from '../users/user-info.dto';
import { OrganizationSummaryCacheDto } from '../organizations/organizations.dto';

export interface MyContactBookDTO {
  userId: string;
  createdDate: number;
  userInfo?: UserInfoDTO;
  organizationInfo?: OrganizationSummaryCacheDto;
}
