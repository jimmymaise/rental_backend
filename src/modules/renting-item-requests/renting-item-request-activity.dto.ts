import { StoragePublicDTO } from '../storages/storage-public.dto';
import { UserInfoDTO } from '../users/user-info.dto';

export interface RentingItemRequestActivityDTO {
  id: string;
  rentingItemRequestId: string;
  comment: string;
  type: string;
  files: StoragePublicDTO[];
  createdDate: number;
  updatedDate: number;
  createdBy?: UserInfoDTO;
  updatedBy?: UserInfoDTO;
}
