import { Injectable } from '@nestjs/common';

import { BaseOrgActivityLogService } from './base-org-activity-log.service';
import { CreateRentingOrderActivityLogModel } from './models';
import { OrgActivityLogType } from './constants/org-activity-log-type.enum';

@Injectable()
export class OrgActivityLogService {
  constructor(private baseOrgActivityLogService: BaseOrgActivityLogService) {}

  public async logCreateNewRentingOrder(
    data: CreateRentingOrderActivityLogModel,
  ): Promise<CreateRentingOrderActivityLogModel> {
    return this.baseOrgActivityLogService.addRentingOrderActivityLog({
      ...data,
      type: OrgActivityLogType.CreateRentingOrder,
    });
  }
}
