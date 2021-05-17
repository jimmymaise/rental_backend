import { CommonAttributesConfig, CommonAttributesType } from '@prisma/client';

import { BaseCustomAttributeCreateModel } from './base-custom-attribute-create.model';

export class RentingOrderItemStatusCreateModel extends BaseCustomAttributeCreateModel {
  public color: string;
  public mapWithSystemStatus?: string;

  public static toCommonAttributesConfig(
    orgId: string,
    userId: string,
    data: RentingOrderItemStatusCreateModel,
  ): CommonAttributesConfig {
    return {
      ...BaseCustomAttributeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
      type: CommonAttributesType.RentingOrderItemStatus,
      customConfigs: {
        color: data.color,
      },

      mapWithSystemValue: data.mapWithSystemStatus,
    } as any;
  }
}

export default RentingOrderItemStatusCreateModel;
