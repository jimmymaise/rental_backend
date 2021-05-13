import { CommonAttributesConfig } from '@prisma/client';

import { SellingOrderSystemStatusTypesMap } from '../constants/selling-order-system-status-types';

export class SellingOrderStatusModel {
  public value: string;
  public label: string;
  public description?: string;
  public color: string;
  public isDefault?: boolean;
  public isDisabled?: boolean;
  public mapWithSystemStatus?: SellingOrderStatusModel;
  public order?: number;

  public static fromCommonAttributesConfig(
    data: CommonAttributesConfig,
  ): SellingOrderStatusModel {
    return {
      value: data.value,
      label: data.label,
      description: data.description,
      color: data.customConfigs ? data.customConfigs['color'] : null,
      isDefault: data.isDefault,
      isDisabled: data.isDisabled,
      mapWithSystemStatus:
        SellingOrderSystemStatusTypesMap[data.mapWithSystemValue],
      order: data.order,
    };
  }
}

export default SellingOrderStatusModel;
