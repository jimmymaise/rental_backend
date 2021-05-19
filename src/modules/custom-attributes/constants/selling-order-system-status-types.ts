import { SellingOrderSystemStatusType } from '@prisma/client';

export const SellingOrderSystemStatusTypesMap = {
  [SellingOrderSystemStatusType.New]: {
    value: SellingOrderSystemStatusType.New,
    label: 'NEW',
    color: '#17b7ff',
  },
  [SellingOrderSystemStatusType.Approved]: {
    value: SellingOrderSystemStatusType.Approved,
    label: 'APPROVED',
    color: '#38d9a9',
  },
  [SellingOrderSystemStatusType.InProgress]: {
    value: SellingOrderSystemStatusType.InProgress,
    label: 'IN_PROGRESS',
    color: '#ffae63',
  },
  [SellingOrderSystemStatusType.Completed]: {
    value: SellingOrderSystemStatusType.Completed,
    label: 'COMPLETED',
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
  SellingOrderSystemStatusTypesMap.Approved,
  SellingOrderSystemStatusTypesMap.InProgress,
  SellingOrderSystemStatusTypesMap.Completed,
  SellingOrderSystemStatusTypesMap.Cancelled,
];
