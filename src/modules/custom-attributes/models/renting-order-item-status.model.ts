import { CommonAttributesConfig } from '@prisma/client';

import { BaseCustomModel } from './base-custom-attribute.model';
import { RentingOrderItemSystemStatusTypesMap } from '../constants/renting-order-item-system-status-types';

export class RentingOrderItemStatusModel extends BaseCustomModel {
  public color: string;
  public mapWithSystemStatus?: RentingOrderItemStatusModel;

  public static fromCommonAttributesConfig(
    data: CommonAttributesConfig,
  ): RentingOrderItemStatusModel {
    return {
      ...BaseCustomModel.fromCommonAttributesConfig(data),
      color: data.customConfigs ? data.customConfigs['color'] : null,
      mapWithSystemStatus:
        RentingOrderItemSystemStatusTypesMap[data.mapWithSystemValue],
    };
  }
}

export default RentingOrderItemStatusModel;
