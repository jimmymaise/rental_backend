import { SellingOrderSystemStatusType } from '@prisma/client';

export const SellingOrderSystemStatusTypesMap = {
  [SellingOrderSystemStatusType.New]: {
    value: SellingOrderSystemStatusType.New,
    label: 'NEW',
    color: '#17b7ff',
  },
  [SellingOrderSystemStatusType.Reserved]: {
    value: SellingOrderSystemStatusType.Reserved,
    label: 'RESERVED',
    color: '#38d9a9',
  },
  [SellingOrderSystemStatusType.PickedUp]: {
    value: SellingOrderSystemStatusType.PickedUp,
    label: 'PICKED_UP',
    color: '#ffae63',
  },
  [SellingOrderSystemStatusType.Returned]: {
    value: SellingOrderSystemStatusType.Returned,
    label: 'RETURNED',
    color: '#2FCC71',
  },
  [SellingOrderSystemStatusType.Cancelled]: {
    value: SellingOrderSystemStatusType.Cancelled,
    label: 'CANCELLED',
    color: '#dd5252',
  },
};

export const SellingOrderSystemStatusTypes = [
  SellingOrderSystemStatusTypesMap.New,
  SellingOrderSystemStatusTypesMap.Reserved,
  SellingOrderSystemStatusTypesMap.PickedUp,
  SellingOrderSystemStatusTypesMap.Returned,
  SellingOrderSystemStatusTypesMap.Cancelled,
];
