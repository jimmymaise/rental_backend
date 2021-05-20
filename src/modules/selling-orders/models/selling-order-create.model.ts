import { RentingOrderItemCreateModel } from './renting-order-item-create.model';
import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { RentingDepositItemCreateModel } from './renting-deposit-item-create.model';

export interface SellingOrderCreateModel {
  orderCustomId: string;
  totalAmount?: number;
  note?: string;
  customerUserId?: string;
  attachedFiles?: StoragePublicDTO[];

  rentingOrderItems?: RentingOrderItemCreateModel[];
  rentingDepositItems?: RentingDepositItemCreateModel[];
}
