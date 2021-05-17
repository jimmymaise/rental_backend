import { RentingOrderItemStatusType } from '@prisma/client';

export const RentingOrderItemSystemStatusTypesMap = {
  [RentingOrderItemStatusType.New]: {
    value: RentingOrderItemStatusType.New,
    label: 'NEW',
    color: '#17b7ff',
  },
  [RentingOrderItemStatusType.Approved]: {
    value: RentingOrderItemStatusType.Approved,
    label: 'APPROVED',
    color: '#38d9a9',
  },
  [RentingOrderItemStatusType.InProgress]: {
    value: RentingOrderItemStatusType.InProgress,
    label: 'IN_PROGRESS',
    color: '#ffae63',
  },
  [RentingOrderItemStatusType.InProgress]: {
    value: RentingOrderItemStatusType.InProgress,
    label: 'IN_PROGRESS',
    color: '#ffae63',
  },
  [RentingOrderItemStatusType.Completed]: {
    value: RentingOrderItemStatusType.Completed,
    label: 'COMPLETED',
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
  RentingOrderItemSystemStatusTypesMap.Approved,
  RentingOrderItemSystemStatusTypesMap.InProgress,
  RentingOrderItemSystemStatusTypesMap.Completed,
  RentingOrderItemSystemStatusTypesMap.Cancelled,
];
