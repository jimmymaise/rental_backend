import { CommonAttributesConfig } from '@prisma/client';

import { BaseCustomModel } from './base-custom-attribute.model';
import { RentingOrderItemSystemStatusTypesMap } from '../constants/renting-order-item-system-status-types';

export class RentingDepositItemStatusModel extends BaseCustomModel {
  public color: string;
  public mapWithSystemStatus?: RentingDepositItemStatusModel;

  public static fromCommonAttributesConfig(
    data: CommonAttributesConfig,
  ): RentingDepositItemStatusModel {
    return {
      ...BaseCustomModel.fromCommonAttributesConfig(data),
      color: data.customConfigs ? data.customConfigs['color'] : null,
      mapWithSystemStatus:
        RentingOrderItemSystemStatusTypesMap[data.mapWithSystemValue],
    };
  }
}

export default RentingDepositItemStatusModel;
