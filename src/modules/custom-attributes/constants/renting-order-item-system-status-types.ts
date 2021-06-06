import { RentingOrderItemStatusType } from '@prisma/client';

export const RentingOrderItemSystemStatusTypesMap = {
  [RentingOrderItemStatusType.New]: {
    value: RentingOrderItemStatusType.New,
    label: 'NEW',
    color: '#17b7ff',
  },
  [RentingOrderItemStatusType.Reserved]: {
    value: RentingOrderItemStatusType.Reserved,
    label: 'RESERVED',
    color: '#38d9a9',
  },
  [RentingOrderItemStatusType.PickedUp]: {
    value: RentingOrderItemStatusType.PickedUp,
    label: 'PICKED_UP',
    color: '#ffae63',
  },
  [RentingOrderItemStatusType.Returned]: {
    value: RentingOrderItemStatusType.Returned,
    label: 'RETURNED',
    color: '#2FCC71',
  },
  [RentingOrderItemStatusType.Cancelled]: {
    value: RentingOrderItemStatusType.Cancelled,
    label: 'CANCELLED',
    color: '#dd5252',
  },
};

export const RentingOrderItemStatusTypes = [
  RentingOrderItemSystemStatusTypesMap.New,
  RentingOrderItemSystemStatusTypesMap.Reserved,
  RentingOrderItemSystemStatusTypesMap.PickedUp,
  RentingOrderItemSystemStatusTypesMap.Returned,
  RentingOrderItemSystemStatusTypesMap.Cancelled,
];
