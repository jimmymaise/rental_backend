import { StoragePublicDTO } from '../../storages/storage-public.dto';

export interface PaymentCreateModel {
  rentingOrderId: string;
  orgId: string;
  payAmount: number;
  code?: string;
  note?: string;
  attachedFiles?: StoragePublicDTO[];
  method: string;
}
