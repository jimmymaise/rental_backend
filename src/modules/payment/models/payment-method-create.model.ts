import { CommonAttributesConfig, CommonAttributesType } from '@prisma/client';

export class PaymentMethodCreateModel {
  public value: string;
  public label: string;
  public description?: string;
  public parentAttributeValue?: string;
  public isDefault?: boolean;
  public isDisabled?: boolean;
  public order?: number;
  public mapWithSystemPaymentMethod?: string;

  public static toCommonAttributesConfig(
    orgId: string,
    userId: string,
    data: PaymentMethodCreateModel,
  ): CommonAttributesConfig {
    return {
      description: data.description,
      value: data.value,
      label: data.label,
      isDefault: false,
      isDisabled: data.isDisabled,
      parentAttributeValue: data.parentAttributeValue,
      org: {
        connect: {
          id: orgId,
        },
      },
      mapWithSystemValue: data.mapWithSystemPaymentMethod,
      type: CommonAttributesType.PaymentMethod,
      updatedBy: userId,
    } as any;
  }
}

export default PaymentMethodCreateModel;
