import { Category, Area, Item } from '@prisma/client';

import { StoragePublicDTO } from '../storages/storage-public.dto';
import { RentingMandatoryVerifyDocumentPublicDTO } from '../renting-mandatory-verify-documents/renting-mandatory-verify-document-public.dto';
import { UserInfoDTO } from '../users/user-info.dto';
import { tryToParseJSON } from '@app/helpers/common';
import { Permission } from './permission.enum';

export interface ItemDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  termAndCondition?: string;
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
  permissions?: Permission[];
}

export function toItemDTO(item: Item, userId: string): ItemDTO {
  if (!item) {
    return null;
  }

  const permissions: Permission[] = [];
  if (userId) {
    permissions.push(Permission.ADD_TO_MY_LIST);

    if (userId === item.ownerUserId) {
      permissions.push(Permission.EDIT_ITEM);
    } else {
      permissions.push(Permission.VIEW_RENTING_REQUEST_BOX);
      permissions.push(Permission.CHAT_WITH_SHOP_OWNER);
      permissions.push(Permission.CREATE_RENTING_REQUEST);
      permissions.push(Permission.VIEW_CHAT_WITH_SHOP_OWNER_BOX);
    }
  } else {
    permissions.push(Permission.VIEW_RENTING_REQUEST_BOX);
    permissions.push(Permission.VIEW_CHAT_WITH_SHOP_OWNER_BOX);
  }

  return {
    ...item,
    createdDate: item.createdDate.getTime(),
    unavailableForRentDays: item.unavailableForRentDays.map((data) =>
      data.getTime(),
    ),
    description: tryToParseJSON(item.description, item.description),
    termAndCondition: tryToParseJSON(
      item.termAndCondition,
      item.termAndCondition,
    ),
    images: tryToParseJSON(item.images, []),
    checkBeforeRentDocuments: tryToParseJSON(item.checkBeforeRentDocuments, []),
    keepWhileRentingDocuments: tryToParseJSON(
      item.keepWhileRentingDocuments,
      [],
    ),
    permissions,
  };
}
