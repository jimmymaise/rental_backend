import { StoragePublicDTO } from '../storages/storage-public.dto'
import { Permission } from './permission.enum'

export interface UserInfoDTO {
  id: string
  displayName: string
  bio: string
  avatarImage: StoragePublicDTO
  coverImage: StoragePublicDTO
  email: string
  createdDate: number
  messengerSocketClientIdMap?: any
}

export interface PublicUserInfoDTO {
  id: string
  displayName: string
  bio: string
  avatarImage: StoragePublicDTO
  coverImage: StoragePublicDTO
  createdDate: number
  permissions: Permission[]
}

export interface UserInfoInputDTO {
  displayName: string
  bio: string
  avatarImage: StoragePublicDTO
  coverImage: StoragePublicDTO
}
