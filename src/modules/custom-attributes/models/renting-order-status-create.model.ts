import { CommonAttributesConfig } from '@prisma/client';

import { CommonAttributesType } from '@app/models';
import { BaseCustomAttributeCreateModel } from './base-custom-attribute-create.model';

export class RentingOrderStatusCreateModel extends BaseCustomAttributeCreateModel {
  public color: string;
  public mapWithSystemStatus?: string;

  public static toCommonAttributesConfig(
    orgId: string,
    userId: string,
    data: RentingOrderStatusCreateModel,
  ): CommonAttributesConfig {
    return {
      ...BaseCustomAttributeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
      type: CommonAttributesType.RentingOrderStatus,
      customConfigs: {
        color: data.color,
      },
      mapWithSystemValue: data.mapWithSystemStatus,
    } as any;
  }
}

export default RentingOrderStatusCreateModel;
