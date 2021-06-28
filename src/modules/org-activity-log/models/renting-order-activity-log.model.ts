import { OrgActivityLog } from '@prisma/client';

import { BaseOrgActivityLogModel } from './base-org-activity-log.model';
import { UpdateAction } from './update-action.model';

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

export class CreateRentingOrderActivityLogModel extends RentingOrderActivityLogModel {
  public data: {
    rentingOrderId: string;
    orderCustomId: string;
  };
}

export class UpdateRentingOrderActivityLogModel extends RentingOrderActivityLogModel {
  public data: {
    rentingOrderId: string;
    orderCustomId: string;
    updateActions: UpdateAction[];
  };
}

export class ChangeRentingOrderStatusActivityLogModel extends RentingOrderActivityLogModel {
  public data: {
    rentingOrderId: string;
    orderCustomId: string;
    fromStatus: {
      value: string;
      color: string;
      label: string;
    };
    toStatus: {
      value: string;
      color: string;
      label: string;
    };
  };
}

export class DeleteRentingOrderActivityLogModel extends RentingOrderActivityLogModel {
  public data: {
    rentingOrderId: string;
    orderCustomId: string;
  };
}
