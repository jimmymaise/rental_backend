import { OrgActivityLog } from '@prisma/client';

import { OrgActivityLogType } from '../constants';

export class BaseOrgActivityLogModel {
  public orgId: string;
  public type?: OrgActivityLogType;
  public createdBy: string;
  public createdDate: number;

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): BaseOrgActivityLogModel {
    return {
      orgId: remoteData.orgId,
      type: remoteData.type as OrgActivityLogType,
      createdBy: remoteData.createdBy,
      createdDate: remoteData.createdDate.getTime(),
    };
  }
}
