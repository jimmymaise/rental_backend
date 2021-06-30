import { OrgActivityLog } from '@prisma/client';

import { OrgActivityLogType } from '../constants';
import { UserInfoDTO } from '../../users/user-info.dto';

export class BaseOrgActivityLogModel {
  public orgId: string;
  public type?: OrgActivityLogType;
  public createdBy: string;
  public createdByDetail?: UserInfoDTO;
  public createdDate?: number;
  public data: any;

  public static fromDatabase(
    remoteData: OrgActivityLog,
    createdByDetail?: any,
  ): BaseOrgActivityLogModel {
    return {
      orgId: remoteData.orgId,
      type: remoteData.type as OrgActivityLogType,
      createdBy: remoteData.createdBy,
      createdDate: remoteData.createdDate.getTime(),
      data: remoteData.data,
      createdByDetail,
    };
  }
}
