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

export interface AddEmployeeByUserIdDTO {
  userId: string;
  roleIds: [string];
}

export interface AddRemoveEmployeeRolesByUserIdDTO {
  userId: string;
  roleIds: [string];
}

export interface UpdateEmployeeRolesByUserIdDTO {
  userId: string;
  roleIds: [string];
  action: 'connect' | 'disconnect' | 'set';
}
