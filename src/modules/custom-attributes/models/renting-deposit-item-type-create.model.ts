import { CommonAttributesConfig, CommonAttributesType } from '@prisma/client';

import { BaseCustomAttributeCreateModel } from './base-custom-attribute-create.model';

export class RentingDepositItemTypeCreateModel extends BaseCustomAttributeCreateModel {
  public mapWithSystemType?: string;

  public static toCommonAttributesConfig(
    orgId: string,
    userId: string,
    data: RentingDepositItemTypeCreateModel,
  ): CommonAttributesConfig {
    return {
      ...BaseCustomAttributeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
      type: CommonAttributesType.RentingDepositItemType,
      mapWithSystemValue: data.mapWithSystemType,
    } as any;
  }
}

export default RentingDepositItemTypeCreateModel;
