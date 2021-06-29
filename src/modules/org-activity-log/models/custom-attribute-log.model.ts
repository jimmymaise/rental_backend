import { OrgActivityLog } from '@prisma/client';

import { BaseOrgActivityLogModel } from './base-org-activity-log.model';
import { UpdateAction } from './update-action.model';

export class CustomAttributeActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): CustomAttributeActivityLogModel {
    return BaseOrgActivityLogModel.fromDatabase(remoteData);
  }
}

export class CreateCustomAttributeActivityLogModel extends CustomAttributeActivityLogModel {
  public data: {
    value: string;
    name: string;
  };
}

export class UpdateCustomAttributeActivityLogModel extends CustomAttributeActivityLogModel {
  public data: {
    value: string;
    name: string;
    updateActions: UpdateAction[];
  };
}

export class DeleteCustomAttributeActivityLogModel extends CustomAttributeActivityLogModel {
  public data: {
    value: string;
    name: string;
  };
}
