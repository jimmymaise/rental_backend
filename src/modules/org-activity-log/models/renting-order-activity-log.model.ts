import { OrgActivityLog } from '@prisma/client';

import { BaseOrgActivityLogModel } from './base-org-activity-log.model';

export class RentingOrderActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public rentingOrderId: string;

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): RentingOrderActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
      rentingOrderId: remoteData['rentingOrderOrgActivityLog']?.rentingOrderId,
    };
  }
}
