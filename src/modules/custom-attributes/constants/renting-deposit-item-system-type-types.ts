import { RentingDepositItemSystemType } from '@app/models';

export const RentingDepositItemSystemTypeTypesMap = {
  [RentingDepositItemSystemType.Money]: {
    value: RentingDepositItemSystemType.Money,
    label: 'MONEY',
  },
  [RentingDepositItemSystemType.Document]: {
    value: RentingDepositItemSystemType.Document,
    label: 'DOCUMENT',
  },
  [RentingDepositItemSystemType.Item]: {
    value: RentingDepositItemSystemType.Item,
    label: 'ITEM',
  },
  [RentingDepositItemSystemType.Other]: {
    value: RentingDepositItemSystemType.Other,
    label: 'OTHER',
  },
};

export const RentingDepositItemSystemTypeTypes = [
  RentingDepositItemSystemTypeTypesMap.Money,
  RentingDepositItemSystemTypeTypesMap.Document,
  RentingDepositItemSystemTypeTypesMap.Item,
  RentingDepositItemSystemTypeTypesMap.Other,
];
