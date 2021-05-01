import { ItemDTO } from '../items/item.dto';
import { UserInfoDTO } from '../users/user-info.dto';

export interface RentingItemRequestDTO {
  id: string;
  rentingItem?: ItemDTO;
  itemId: string;
  totalAmount?: number;
  actualTotalAmount?: number;
  rentTotalQuantity?: number;
  fromDate: number;
  toDate: number;
  status?: string;
  ownerUserId: string;
  ownerUserDetail?: UserInfoDTO;
  lenderUserId: string;
  lenderUserDetail?: UserInfoDTO;
  createdDate: number;
  updatedDate: number;
  permissions?: string[];
}
