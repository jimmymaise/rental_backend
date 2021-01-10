import { Category, Area, Item } from '@prisma/client';

import { StoragePublicDTO } from '../storages/storage-public.dto';
import { RentingMandatoryVerifyDocumentPublicDTO } from '../renting-mandatory-verify-documents/renting-mandatory-verify-document-public.dto';
import { UserInfoDTO } from '../users/user-info.dto';

export interface ItemDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categories?: Category[];
  areas?: Area[];
  images?: StoragePublicDTO[];
  roughAddress?: string;
  checkBeforeRentDocuments?: RentingMandatoryVerifyDocumentPublicDTO[];
  keepWhileRentingDocuments?: RentingMandatoryVerifyDocumentPublicDTO[];
  unavailableForRentDays?: number[];
  currentOriginalPrice?: number;
  sellPrice?: number;
  rentPricePerDay?: number;
  rentPricePerWeek?: number;
  rentPricePerMonth?: number;
  note?: string;
  currencyCode?: string;
  summaryReviewCore?: number;
  summaryReviewCount?: number;
  availableQuantity?: number;
  totalQuantity?: number;
  isVerified?: boolean;
  status: string;
  isInMyWishList?: boolean;
  createdDate: number;
  createdBy?: UserInfoDTO;
}

export function toItemDTO(item: Item): ItemDTO {
  if (!item) {
    return null;
  }

  return {
    ...item,
    createdDate: item.createdDate.getTime(),
    unavailableForRentDays: item.unavailableForRentDays.map((data) =>
      data.getTime(),
    ),
    images: item.images && item.images.length ? JSON.parse(item.images) : [],
    checkBeforeRentDocuments:
      item.checkBeforeRentDocuments && item.checkBeforeRentDocuments.length
        ? JSON.parse(item.checkBeforeRentDocuments)
        : [],
    keepWhileRentingDocuments:
      item.keepWhileRentingDocuments && item.keepWhileRentingDocuments.length
        ? JSON.parse(item.keepWhileRentingDocuments)
        : [],
  };
}
