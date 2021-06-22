import { StoragePublicDTO } from '../../storages/storage-public.dto';

export class PaymentCreateModel {
  public payAmount: number;
  public refId?: string;
  public note?: string;
  public attachedFiles?: StoragePublicDTO[];
  public method: string;
  public transactionOwner?: string;
}
