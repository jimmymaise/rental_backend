import { PaymentMethodSystemType } from '@prisma/client';

export const PaymentMethodSystemTypeTypesMap = {
  [PaymentMethodSystemType.PromoCode]: {
    value: PaymentMethodSystemType.PromoCode,
    label: 'PROMO_CODE',
  },
  [PaymentMethodSystemType.RewardPoints]: {
    value: PaymentMethodSystemType.RewardPoints,
    label: 'REWARD_POINTS',
  },
  [PaymentMethodSystemType.BankTransfer]: {
    value: PaymentMethodSystemType.BankTransfer,
    label: 'BANK_TRANSFER',
  },
  [PaymentMethodSystemType.Card]: {
    value: PaymentMethodSystemType.Card,
    label: 'CARD',
  },
  [PaymentMethodSystemType.Cash]: {
    value: PaymentMethodSystemType.Cash,
    label: 'CASH',
  },
  [PaymentMethodSystemType.MobileMoney]: {
    value: PaymentMethodSystemType.MobileMoney,
    label: 'MOBILE_MONEY',
  },
  [PaymentMethodSystemType.Other]: {
    value: PaymentMethodSystemType.Other,
    label: 'OTHER',
  },
};

export const PaymentMethodSystemTypeTypes = [
  PaymentMethodSystemTypeTypesMap.Cash,
  PaymentMethodSystemTypeTypesMap.Card,
  PaymentMethodSystemTypeTypesMap.MobileMoney,
  PaymentMethodSystemTypeTypesMap.BankTransfer,
  PaymentMethodSystemTypeTypesMap.RewardPoints,
  PaymentMethodSystemTypeTypesMap.PromoCode,
  PaymentMethodSystemTypeTypesMap.Other,
];
