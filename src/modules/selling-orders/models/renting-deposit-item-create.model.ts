import { StoragePublicDTO } from '../../storages/storage-public.dto';

export interface RentingDepositItemCreateModel {
  type: string;
  note?: string;
  valueAmount?: number;
  attachedFiles?: StoragePublicDTO[];
}
