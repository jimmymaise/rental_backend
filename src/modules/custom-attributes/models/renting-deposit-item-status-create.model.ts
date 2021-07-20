import { CommonAttributesConfig } from '@prisma/client';

import { CommonAttributesType } from '@app/models';
import { BaseCustomAttributeCreateModel } from './base-custom-attribute-create.model';

export class RentingDepositItemStatusCreateModel extends BaseCustomAttributeCreateModel {
  public color: string;
  public mapWithSystemStatus?: string;

  public static toCommonAttributesConfig(
    orgId: string,
    userId: string,
    data: RentingDepositItemStatusCreateModel,
  ): CommonAttributesConfig {
    return {
      ...BaseCustomAttributeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
      type: CommonAttributesType.RentingDepositItemStatus,
      customConfigs: {
        color: data.color,
      },

      mapWithSystemValue: data.mapWithSystemStatus,
    } as any;
  }
}

export default RentingDepositItemStatusCreateModel;
