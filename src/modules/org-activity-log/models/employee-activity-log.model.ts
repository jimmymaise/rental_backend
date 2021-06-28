import { OrgActivityLog } from '@prisma/client';

import { BaseOrgActivityLogModel } from './base-org-activity-log.model';
import { UpdateAction } from './update-action.model';

export class EmployeeActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public employeeId: string;

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): EmployeeActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
      employeeId: remoteData['EmployeeOrgActivityLog']?.employeeId,
    };
  }
}

export class AddEmployeeActivityLogModel extends EmployeeActivityLogModel {
  public data: {
    employeeId: string;
    employeeName: string;
  };
}

export class UpdateEmployeeActivityLogModel extends EmployeeActivityLogModel {
  public data: {
    employeeId: string;
    employeeName: string;
    updateActions: UpdateAction[];
  };
}

export class RemoveEmployeeActivityLogModel extends EmployeeActivityLogModel {
  public data: {
    employeeId: string;
    employeeName: string;
  };
}
