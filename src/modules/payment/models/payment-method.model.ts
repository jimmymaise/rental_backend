import { CommonAttributesConfig } from '@prisma/client';

import { PaymentMethodSystemTypeTypes } from '../constants/payment-method-system-type-types';

export class PaymentMethodModel {
  public value: string;
  public label: string;
  public description?: string;
  public isDefault?: boolean;
  public isDisabled?: boolean;
  public order?: number;
  public parentAttributeValue?: string;
  public mapWithSystemPaymentMethod?: PaymentMethodModel;

  public static fromCommonAttributesConfig(
    data: CommonAttributesConfig,
  ): PaymentMethodModel {
    return {
      value: data.value,
      label: data.label,
      description: data.description,
      isDefault: data.isDefault,
      isDisabled: data.isDisabled,
      order: data.order,
      parentAttributeValue: data.parentAttributeValue,
      mapWithSystemPaymentMethod:
        PaymentMethodSystemTypeTypes[data.mapWithSystemValue],
    };
  }
}

export default PaymentMethodModel;
