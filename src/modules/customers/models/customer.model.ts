import { Customer } from '@prisma/client';

import { UserInfoDTO } from '../../users/user-info.dto';
import { CustomerCreateModel } from './customer-create.model';

export class CustomerModel extends CustomerCreateModel {
  public id: string;
  public userId?: string;
  public userInfo?: Partial<UserInfoDTO>;

  public static fromCustomer(data: Customer): CustomerModel {
    return {
      ...CustomerCreateModel.fromCustomer(data),
      id: data.id,
      userId: data.userId,
    };
  }
}
