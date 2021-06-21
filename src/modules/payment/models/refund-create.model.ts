import { StoragePublicDTO } from '../../storages/storage-public.dto';

export interface RefundCreateModel {
  rentingOrderId: string;
  payAmount: number;
  refId?: string;
  refundToTransactionId?: string;
  note?: string;
  attachedFiles?: StoragePublicDTO[];
  method: string;
}
