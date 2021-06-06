import { RentingDepositItemSystemStatusType } from '@prisma/client';

export const RentingDepositItemSystemStatusTypesMap = {
  [RentingDepositItemSystemStatusType.New]: {
    value: RentingDepositItemSystemStatusType.New,
    label: 'NEW',
    color: '#17b7ff',
  },
  [RentingDepositItemSystemStatusType.PickedUp]: {
    value: RentingDepositItemSystemStatusType.PickedUp,
    label: 'APPROVED',
    color: '#ffae63',
  },
  [RentingDepositItemSystemStatusType.Returned]: {
    value: RentingDepositItemSystemStatusType.Returned,
    label: 'RETURNED',
    color: '#2FCC71',
  },
};

export const RentingDepositItemSystemStatusTypes = [
  RentingDepositItemSystemStatusTypesMap.New,
  RentingDepositItemSystemStatusTypesMap.PickedUp,
  RentingDepositItemSystemStatusTypesMap.Returned,
];
