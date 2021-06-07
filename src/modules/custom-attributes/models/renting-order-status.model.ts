import { CommonAttributesConfig } from '@prisma/client';

import { BaseCustomModel } from './base-custom-attribute.model';
import { RentingOrderSystemStatusTypesMap } from '../constants/renting-order-system-status-types';

export class RentingOrderStatusModel extends BaseCustomModel {
  public color: string;
  public mapWithSystemStatus?: RentingOrderStatusModel;

  public static fromCommonAttributesConfig(
    data: CommonAttributesConfig,
  ): RentingOrderStatusModel {
    return {
      ...BaseCustomModel.fromCommonAttributesConfig(data),
      color: data.customConfigs ? data.customConfigs['color'] : null,
      mapWithSystemStatus:
        RentingOrderSystemStatusTypesMap[data.mapWithSystemValue],
    };
  }
}

export default RentingOrderStatusModel;
