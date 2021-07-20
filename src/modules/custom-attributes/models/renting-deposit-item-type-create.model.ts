import { CommonAttributesConfig } from '@prisma/client';

import { CommonAttributesType } from '@app/models';
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
