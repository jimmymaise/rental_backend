import { OrgActivityLog } from '@prisma/client';

import { BaseOrgActivityLogModel } from './base-org-activity-log.model';
import { UpdateAction } from './update-action.model';

export class CustomerActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public customerId: string;

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): CustomerActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
      customerId: remoteData['customerOrgActivityLog']?.customerId,
    };
  }
}

export class CreateCustomerActivityLogModel extends CustomerActivityLogModel {
  public data: {
    customerId: string;
    customerName: string;
  };
}

export class UpdateCustomerActivityLogModel extends CustomerActivityLogModel {
  public data: {
    customerId: string;
    customerName: string;
    updateActions: UpdateAction[];
  };
}
