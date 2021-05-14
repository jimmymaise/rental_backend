import { CommonAttributesConfig, CommonAttributesType } from '@prisma/client';

export class SellingOrderStatusCreateModel {
  public value: string;
  public label: string;
  public description?: string;
  public color: string;
  public isDefault?: boolean;
  public isDisabled?: boolean;
  public mapWithSystemStatus?: string;
  public order?: number;

  public static toCommonAttributesConfig(
    orgId: string,
    userId: string,
    data: SellingOrderStatusCreateModel,
  ): CommonAttributesConfig {
    return {
      description: data.description,
      value: data.value,
      label: data.label,
      type: CommonAttributesType.SellingOrderStatus,
      customConfigs: {
        color: data.color,
      },
      isDefault: false,
      isDisabled: data.isDisabled,
      mapWithSystemValue: data.mapWithSystemStatus,
      org: {
        connect: {
          id: orgId,
        },
      },
      updatedBy: userId,
    } as any;
  }
}

export default SellingOrderStatusCreateModel;
