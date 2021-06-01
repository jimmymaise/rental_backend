import { CommonAttributesConfig } from '@prisma/client';

export class BaseCustomAttributeCreateModel {
  public value: string;
  public label: string;
  public description?: string;
  public parentAttributeValue?: string;
  public isDefault?: boolean;
  public isDisabled?: boolean;
  public order?: number;

  public static toCommonAttributesConfig(
    orgId: string,
    userId: string,
    data: BaseCustomAttributeCreateModel,
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
      updatedBy: userId,
    } as any;
  }
}

export default BaseCustomAttributeCreateModel;
