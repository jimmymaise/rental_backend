import { CommonAttributesConfig } from '@prisma/client';

import { BaseCustomModel } from './base-custom-attribute.model';
import { RentingDepositItemSystemTypeTypesMap } from '../constants/renting-deposit-item-system-type-types';

export class RentingDepositItemTypeModel extends BaseCustomModel {
  public mapWithSystemType?: RentingDepositItemTypeModel;

  public static fromCommonAttributesConfig(
    data: CommonAttributesConfig,
  ): RentingDepositItemTypeModel {
    return {
      ...BaseCustomModel.fromCommonAttributesConfig(data),
      mapWithSystemType:
        RentingDepositItemSystemTypeTypesMap[data.mapWithSystemValue],
    };
  }
}

export default RentingDepositItemTypeModel;
