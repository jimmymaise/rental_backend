import { StoragePublicDTO } from '../storages/storage-public.dto';
import { Permission } from '@modules/auth/permission/permission.enum';
import { User } from '@prisma/client';

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

export type UserInfoForMakingToken = User & {
  roles: any[], orgsThisUserBelongTo: any[]
}


