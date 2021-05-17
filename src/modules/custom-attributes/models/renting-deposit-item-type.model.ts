import { CommonAttributesConfig } from '@prisma/client';

import { BaseCustomModel } from './base-custom-attribute.model';
import { RentingOrderItemSystemStatusTypesMap } from '../constants/renting-order-item-system-status-types';

export class RentingDepositItemTypeModel extends BaseCustomModel {
  public mapWithSystemValue?: RentingDepositItemTypeModel;

  public static fromCommonAttributesConfig(
    data: CommonAttributesConfig,
  ): RentingDepositItemTypeModel {
    return {
      ...BaseCustomModel.fromCommonAttributesConfig(data),
      mapWithSystemValue:
        RentingOrderItemSystemStatusTypesMap[data.mapWithSystemValue],
    };
  }
}

export default RentingDepositItemTypeModel;
