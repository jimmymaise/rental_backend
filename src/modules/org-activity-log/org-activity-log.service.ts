import { Injectable } from '@nestjs/common';

import { BaseOrgActivityLogService } from './base-org-activity-log.service';
import {
  CreateRentingOrderActivityLogModel,
  UpdateRentingOrderActivityLogModel,
  ChangeRentingOrderStatusActivityLogModel,
  DeleteRentingOrderActivityLogModel,
} from './models';
import { OrgActivityLogType } from './constants/org-activity-log-type.enum';

@Injectable()
export class OrgActivityLogService {
  constructor(private baseOrgActivityLogService: BaseOrgActivityLogService) {}

  // Renting Order Activity Logs
  public async logCreateNewRentingOrder(
    data: CreateRentingOrderActivityLogModel,
  ): Promise<CreateRentingOrderActivityLogModel> {
    return this.baseOrgActivityLogService.addRentingOrderActivityLog({
      ...data,
      type: OrgActivityLogType.CreateRentingOrder,
    });
  }

  public async logUpdateRentingOrder(
    data: UpdateRentingOrderActivityLogModel,
  ): Promise<UpdateRentingOrderActivityLogModel> {
    return this.baseOrgActivityLogService.addRentingOrderActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateRentingOrder,
    });
  }

  public async logChangeRentingOrderStatus(
    data: ChangeRentingOrderStatusActivityLogModel,
  ): Promise<ChangeRentingOrderStatusActivityLogModel> {
    return this.baseOrgActivityLogService.addRentingOrderActivityLog({
      ...data,
      type: OrgActivityLogType.ChangeStatusRentingOrder,
    });
  }

  public async logDeleteRentingOrder(
    data: DeleteRentingOrderActivityLogModel,
  ): Promise<DeleteRentingOrderActivityLogModel> {
    return this.baseOrgActivityLogService.addRentingOrderActivityLog({
      ...data,
      type: OrgActivityLogType.DeleteReningOrder,
    });
  }
}
