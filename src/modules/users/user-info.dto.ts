import { StoragePublicDTO } from '../storages/storage-public.dto'

export interface UserInfoDTO {
  id: string
  displayName: string
  bio: string
  avatarImage: StoragePublicDTO
  coverImage: StoragePublicDTO
  email: string
  createdDate: number
}

export interface UserInfoInputDTO {
  displayName: string
  bio: string
  avatarImage: StoragePublicDTO
  coverImage: StoragePublicDTO
}
