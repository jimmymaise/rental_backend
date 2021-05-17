import { RentingDepositItemSystemType } from '@prisma/client';

export const RentingDepositItemSystemTypeTypesMap = {
  [RentingDepositItemSystemType.Money]: {
    value: RentingDepositItemSystemType.Money,
    label: 'NEW',
    color: '#17b7ff',
  },
  [RentingDepositItemSystemType.Document]: {
    value: RentingDepositItemSystemType.Document,
    label: 'APPROVED',
    color: '#38d9a9',
  },
  [RentingDepositItemSystemType.Item]: {
    value: RentingDepositItemSystemType.Item,
    label: 'RETURNED',
    color: '#2FCC71',
  },
  [RentingDepositItemSystemType.Other]: {
    value: RentingDepositItemSystemType.Other,
    label: 'RETURNED',
    color: '#2FCC71',
  },
};

export const RentingDepositItemSystemTypeTypes = [
  RentingDepositItemSystemTypeTypesMap.Money,
  RentingDepositItemSystemTypeTypesMap.Document,
  RentingDepositItemSystemTypeTypesMap.Item,
  RentingDepositItemSystemTypeTypesMap.Other,
];
