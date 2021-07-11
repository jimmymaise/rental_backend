import { StoragePublicDTO } from '../../storages/storage-public.dto';

export interface TopItemInTimeRangeModel {
  id: string;
  name: string;
  images?: StoragePublicDTO[];
  newRentingOrderCount: number;
  cancelledRentingOrderCount: number;
  viewCount: number;
  amount: number;
  payDamagesAmount: number;
  refundDamagesAmount: number;
  returnedRentingOrderCount: number;
}

export default TopItemInTimeRangeModel;
