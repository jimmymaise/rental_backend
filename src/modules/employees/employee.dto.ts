import { StoragePublicDTO } from '../storages/storage-public.dto';

export interface EmployeeDto {
  id: string;
  orgId: string;
  userId: string;
  isOwner: boolean;
  userInfo: EmployeeUserInfo;
}

export interface EmployeeUserInfo {
  id: string;
  displayName?: string;
  bio?: string;
  avatarImage: StoragePublicDTO;
  coverImage: StoragePublicDTO;
  email?: string;
  phoneNumber?: string;
  authPhoneNumber?: string;
  lastSignedIn?: number;
  createdDate?: number;
  isDeleted?: boolean;
}
