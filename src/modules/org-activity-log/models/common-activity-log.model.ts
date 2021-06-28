import { OrgActivityLog } from '@prisma/client';

import { BaseOrgActivityLogModel } from './base-org-activity-log.model';
import { UpdateAction } from './update-action.model';

// Role
export class CreateRoleActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    roleId: string;
    roleName: string;
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): CreateRoleActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

export class UpdateRoleActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    roleId: string;
    roleName: string;
    updateActions: UpdateAction[];
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): UpdateRoleActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

export class DeleteRoleActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    roleId: string;
    roleName: string;
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): DeleteRoleActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

// Org Informations
export class UpdateOrgInformationActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    orgId: string;
    orgName: string;
    updateActions: UpdateAction[];
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): UpdateOrgInformationActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

// Category
export class CreateCategoryActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    categoryId: string;
    categoryName: string;
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): CreateCategoryActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

export class UpdateCategoryActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    categoryId: string;
    categoryName: string;
    updateActions: UpdateAction[];
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): UpdateCategoryActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

export class DeleteCategoryActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    categoryId: string;
    categoryName: string;
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): CreateCategoryActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

// Renting Order Payment
export class CreatePayForRentingOrderActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    rentingOrderId: string;
    orderCustomId: string;
    amount: number;
    method: {
      value: string;
      label: string;
    };
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): CreatePayForRentingOrderActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

export class CreateRefundForRentingOrderActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    rentingOrderId: string;
    refundForTransactionId: string;
    orderCustomId: string;
    amount: number;
    method: {
      value: string;
      label: string;
    };
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): CreatePayForRentingOrderActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

export class CreateDamagesPayForRentingOrderItemActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    rentingOrderId: string;
    orderCustomId: string;
    rentingOrderItemId: string;
    itemName: string;
    amount: number;
    method: {
      value: string;
      label: string;
    };
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): CreatePayForRentingOrderActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}

export class CreateDamagesRefundForRentingOrderItemActivityLogModel extends BaseOrgActivityLogModel {
  public orgActivityLogId?: string;
  public data: {
    rentingOrderId: string;
    orderCustomId: string;
    rentingOrderItemId: string;
    itemName: string;
    amount: number;
    method: {
      value: string;
      label: string;
    };
  };

  public static fromDatabase(
    remoteData: OrgActivityLog,
  ): CreatePayForRentingOrderActivityLogModel {
    return {
      ...BaseOrgActivityLogModel.fromDatabase(remoteData),
    };
  }
}
