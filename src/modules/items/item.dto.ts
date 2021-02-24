import { Category, Area, Item, ItemStatus } from '@prisma/client';

import { StoragePublicDTO } from '../storages/storage-public.dto';
import { RentingMandatoryVerifyDocumentPublicDTO } from '../renting-mandatory-verify-documents/renting-mandatory-verify-document-public.dto';
import { UserInfoDTO } from '../users/user-info.dto';
import { tryToParseJSON } from '@app/helpers/common';
import { Permission } from './permission.enum';
import { SystemPermission } from '@app/system-permission';
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
  updatedDate: number;
  createdDate: number;
  createdBy?: UserInfoDTO;
  permissions?: Permission[];
}

export function toItemDTO(
  item: Item,
  userId: string = null,
  userSystemPermissions: SystemPermission[] = [],
): ItemDTO {
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

  if (userSystemPermissions) {
    if (userSystemPermissions.includes(SystemPermission.ROOT)) {
      permissions.push(Permission.EDIT_ITEM);

      if (item.status === ItemStatus.Draft) {
        permissions.push(Permission.CHANGE_TO_BLOCKED);
        permissions.push(Permission.CHANGE_TO_PUBLISHED);
      } else if (item.status === ItemStatus.Blocked) {
        permissions.push(Permission.CHANGE_TO_DRAFT);
        permissions.push(Permission.CHANGE_TO_PUBLISHED);
      } else if (item.status === ItemStatus.Published) {
        permissions.push(Permission.CHANGE_TO_DRAFT);
        permissions.push(Permission.CHANGE_TO_BLOCKED);
      }

      if (item.isVerified) {
        permissions.push(Permission.REJECT_ITEM);
      } else {
        permissions.push(Permission.APPROVE_ITEM);
      }
    }
  }

  return {
    ...item,
    createdDate: item.createdDate?.getTime
      ? item.createdDate.getTime()
      : new Date(item.createdDate).getTime(), // Parse for RedisCache
    updatedDate: item.updatedDate?.getTime
      ? item.updatedDate.getTime()
      : new Date(item.updatedDate).getTime(), // Parse for RedisCache
    unavailableForRentDays: item.unavailableForRentDays.map((data) =>
      data?.getTime ? data.getTime() : new Date(data).getTime(),
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
