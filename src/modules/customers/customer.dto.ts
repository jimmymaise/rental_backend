import { StoragePublicDTO } from '../storages/storage-public.dto';

export interface CustomerDto {
  id: string;
  orgId: string;
  userId: string;
  displayName?: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  birthday?: number;
  userInfo: CustomerUserInfo;
  createdDate?: number;
}

export interface CustomerUserInfo {
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
