import { StoragePublicDTO } from '../../storages/storage-public.dto';

export interface RentingOrderItemCreateModel {
  sku?: string;
  name?: string;
  note?: string;
  amount?: number;
  quantity?: number;
  pickupDateTime?: number;
  returningDateTime?: number;
  unitPrice?: number;
  unitPricePerDay?: number;
  unitPricePerWeek?: number;
  unitPricePerMonth?: number;
  attachedFiles?: StoragePublicDTO[];
  itemId: string;
}
