import { CommonAttributesConfig } from '@prisma/client';
export class BaseCustomModel {
  public value: string;
  public label: string;
  public description?: string;
  public isDefault?: boolean;
  public isDisabled?: boolean;
  public order?: number;
  public parentAttributeValue?: string;

  public static fromCommonAttributesConfig(
    data: CommonAttributesConfig,
  ): BaseCustomModel {
    return {
      value: data.value,
      label: data.label,
      description: data.description,
      isDefault: data.isDefault,
      isDisabled: data.isDisabled,
      order: data.order,
      parentAttributeValue: data.parentAttributeValue,
    };
  }
}

export default BaseCustomModel;
