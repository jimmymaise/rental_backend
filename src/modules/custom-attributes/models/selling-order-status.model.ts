import { CommonAttributesConfig } from '@prisma/client';

import { BaseCustomModel } from './base-custom-attribute.model';
import { SellingOrderSystemStatusTypesMap } from '../constants/selling-order-system-status-types';

export class SellingOrderStatusModel extends BaseCustomModel {
  public color: string;
  public mapWithSystemStatus?: SellingOrderStatusModel;

  public static fromCommonAttributesConfig(
    data: CommonAttributesConfig,
  ): SellingOrderStatusModel {
    return {
      ...BaseCustomModel.fromCommonAttributesConfig(data),
      color: data.customConfigs ? data.customConfigs['color'] : null,
      mapWithSystemStatus:
        SellingOrderSystemStatusTypesMap[data.mapWithSystemValue],
    };
  }
}

export default SellingOrderStatusModel;
