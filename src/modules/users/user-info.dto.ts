import { StoragePublicDTO } from '../storages/storage-public.dto';
import { Permission } from './permission.enum';

export interface UserInfoDTO {
  id: string;
  displayName?: string;
  bio?: string;
  avatarImage: StoragePublicDTO;
  coverImage: StoragePublicDTO;
  email?: string;
  phoneNumber?: string;
  lastSignedIn?: number;
  createdDate?: number;
  isDeleted?: boolean;
}

export interface PublicUserInfoDTO {
  id: string;
  displayName: string;
  bio: string;
  avatarImage: StoragePublicDTO;
  coverImage: StoragePublicDTO;
  createdDate: number;
  phoneNumber?: string;
  permissions: Permission[];
}

export interface UserInfoInputDTO {
  displayName: string;
  bio: string;
  phoneNumber: string;
  avatarImage: StoragePublicDTO;
  coverImage: StoragePublicDTO;
}
