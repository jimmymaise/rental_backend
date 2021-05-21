import { Customer } from '@prisma/client';

export class CustomerCreateModel {
  public email?: string;
  public phoneNumber?: string;
  public address?: string;
  public birthday?: number;
  public displayName?: string;
  public gender?: string;

  public static fromCustomer(customer: Customer): CustomerCreateModel {
    return {
      address: customer.address,
      birthday: customer.birthday?.getTime(),
      displayName: customer.displayName,
      email: customer.email,
      gender: customer.gender,
      phoneNumber: customer.phoneNumber,
    };
  }
}
