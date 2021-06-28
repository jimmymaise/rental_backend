import { OrgActivityLog } from '@prisma/client';

import { BaseOrgActivityLogModel } from './base-org-activity-log.model';
import { UpdateAction } from './update-action.model';

export class ItemActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public itemId: string;

  public static fromDatabase(remoteData: OrgActivityLog): ItemActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
      itemId: remoteData['itemOrgActivityLog']?.itemId,
    };
  }
}

export class CreateItemActivityLogModel extends ItemActivityLogModel {
  public data: {
    itemId: string;
    itemName: string;
  };
}

export class UpdateItemActivityLogModel extends ItemActivityLogModel {
  public data: {
    itemId: string;
    itemName: string;
    updateActions: UpdateAction[];
  };
}

export class DeleteItemActivityLogModel extends ItemActivityLogModel {
  public data: {
    itemId: string;
    itemName: string;
  };
}
