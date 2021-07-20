import { RentingOrderSystemStatusType } from '@app/models';

export const RentingOrderSystemStatusTypesMap = {
  [RentingOrderSystemStatusType.New]: {
    value: RentingOrderSystemStatusType.New,
    label: 'NEW',
    color: '#17b7ff',
  },
  [RentingOrderSystemStatusType.Reserved]: {
    value: RentingOrderSystemStatusType.Reserved,
    label: 'RESERVED',
    color: '#38d9a9',
  },
  [RentingOrderSystemStatusType.PickedUp]: {
    value: RentingOrderSystemStatusType.PickedUp,
    label: 'PICKED_UP',
    color: '#ffae63',
  },
  [RentingOrderSystemStatusType.Returned]: {
    value: RentingOrderSystemStatusType.Returned,
    label: 'RETURNED',
    color: '#2FCC71',
  },
  [RentingOrderSystemStatusType.Cancelled]: {
    value: RentingOrderSystemStatusType.Cancelled,
    label: 'CANCELLED',
    color: '#dd5252',
  },
};

export const RentingOrderSystemStatusTypes = [
  RentingOrderSystemStatusTypesMap.New,
  RentingOrderSystemStatusTypesMap.Reserved,
  RentingOrderSystemStatusTypesMap.PickedUp,
  RentingOrderSystemStatusTypesMap.Returned,
  RentingOrderSystemStatusTypesMap.Cancelled,
];
