import { ItemDTO } from '../items/item.dto'
import { User } from '@prisma/client';

export interface RentingItemRequestDTO {
  id: string
  rentingItem?: ItemDTO
  rentingItemCachedInfo: {
    name: string
    images: {
      id: string
      url: string
    }[],
    rentPricePerDay: number
    rentPricePerWeek: number
    rentPricePerMonth: number
    currencyCode: string
  },
  itemId: string
  totalAmount?: number
  actualTotalAmount?: number
  rentTotalQuantity?: number
  fromDate: number
  toDate: number
  status?: string
  ownerUserId: string
  ownerUserDetail?: User
  lenderUserId: string
  lenderUserDetail?: User
  createdDate: number
  updatedDate: number
  permissions?: string[]
}
