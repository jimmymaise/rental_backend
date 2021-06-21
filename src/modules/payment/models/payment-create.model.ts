import { StoragePublicDTO } from '../../storages/storage-public.dto';

export interface PaymentCreateModel {
  rentingOrderId: string;
  orgId: string;
  payAmount: number;
  refId?: string;
  note?: string;
  attachedFiles?: StoragePublicDTO[];
  method: string;
}
