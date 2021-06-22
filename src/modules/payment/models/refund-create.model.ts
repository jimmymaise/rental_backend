import { StoragePublicDTO } from '../../storages/storage-public.dto';

export class RefundCreateModel {
  public rentingOrderId: string;
  public payAmount: number;
  public refId?: string;
  public refundToTransactionId?: string;
  public note?: string;
  public attachedFiles?: StoragePublicDTO[];
  public method: string;
  public transactionOwner?: string;
}
