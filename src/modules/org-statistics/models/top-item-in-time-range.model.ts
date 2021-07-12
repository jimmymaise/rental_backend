import { StoragePublicDTO } from '../../storages/storage-public.dto';

export interface TopItemInTimeRangeModel {
  id: string;
  pid: string;
  name: string;
  images?: StoragePublicDTO[];
  slug: string;
  newRentingOrderCount: number;
  cancelledRentingOrderCount: number;
  viewCount: number;
  amount: number;
  payDamagesAmount: number;
  refundDamagesAmount: number;
  returnedRentingOrderCount: number;
  sku?: string;
}

export default TopItemInTimeRangeModel;
