import { OrgActivityLog } from '@prisma/client';

import { BaseOrgActivityLogModel } from './base-org-activity-log.model';
import { UpdateAction } from './update-action.model';

export class RentingOrderActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public rentingOrderId: string;
  public updateActions: UpdateAction[];

  public static toDatabaseDataJSON(data: RentingOrderActivityLogModel): any {
    return {
      updateActions: data.updateActions,
    };
  }

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): RentingOrderActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
      updateActions: remoteData.data['updateActions'],
      rentingOrderId: remoteData['rentingOrderOrgActivityLog']?.rentingOrderId,
    };
  }
}
