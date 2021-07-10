import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CustomerDto } from './customer.dto';

import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';

import { OffsetPaginationDTO } from '@app/models';
import { UsersService } from '@modules/users/users.service';
import { CustomerModel, CustomerCreateModel } from './models';
import { User } from '@prisma/client';
import { OrgActivityLogService } from '@modules/org-activity-log/org-activity-log.service';
import { OrgStatisticLogService } from '@modules/org-statistics/org-statistic-log.service';

@Injectable()
export class CustomersService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private orgActivityLogService: OrgActivityLogService,
    private orgStatisticLogService: OrgStatisticLogService,
  ) {}

  public async getCustomersWithOffsetPaging(
    whereQuery: any,
    pageSize: number,
    offset?: any,
    orderBy: any = { id: 'desc' },
    include?: any,
  ): Promise<OffsetPaginationDTO<CustomerDto>> {
    const pagingHandler = new OffsetPagingHandler(
      whereQuery,
      pageSize,
      orderBy,
      this.prismaService,
      'customer',
      include,
    );
    return pagingHandler.getPage(offset);
  }

  public async getCustomersByOrgIdWithOffsetPaging(
    orgId,
    pageSize: number,
    offset?: any,
    orderBy?: any,
    include?: any,
  ): Promise<OffsetPaginationDTO<CustomerDto>> {
    const whereQuery = {
      orgId: orgId,
    };

    return this.getCustomersWithOffsetPaging(
      whereQuery,
      pageSize,
      offset,
      orderBy,
      include,
    );
  }

  public async createCustomer({
    orgId,
    createdBy,
    data,
  }: {
    orgId: string;
    createdBy: string;
    data: CustomerCreateModel;
  }): Promise<CustomerModel> {
    if (!data.email && !data.phoneNumber) {
      throw new Error('User must have email or phone number');
    }

    let user: User;
    if (data.email) {
      user = await this.usersService.getSimpleUserByEmail(data.email);
    }

    if (data.phoneNumber && !user) {
      user = await this.usersService.getSimpleUserByPhoneNumber(
        data.phoneNumber,
      );
    }

    if (!user) {
      // Create new user
      // TODO: send password to email, or PhoneNumber. Check OTP phone
      const defaultPassword = new Date().getTime().toString();

      if (data.email) {
        user = await this.usersService.createUserByEmailPassword(
          data.email,
          defaultPassword,
        );
      }

      if (data.phoneNumber && !user) {
        user = await this.usersService.createUserByPhonePassword(
          data.phoneNumber,
          defaultPassword,
        );
      }

      await this.usersService.createTheProfileForUser(user.id, {
        displayName: data.displayName,
        phoneNumber: data.phoneNumber,
        bio: '',
      });
    }

    const customer = await this.prismaService.customer.create({
      data: {
        address: data.address,
        birthday: data.birthday ? new Date(data.birthday) : null,
        email: data.email,
        phoneNumber: data.phoneNumber,
        organization: {
          connect: {
            id: orgId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        createdBy,
      },
    });

    this.orgActivityLogService.logCreateCustomer({
      createdBy,
      customerId: customer.id,
      orgId,
      data: {
        customerId: customer.id,
        customerName:
          customer.displayName || customer.email || customer.phoneNumber,
      },
    });

    // Return all data
    return CustomerModel.fromCustomer(customer);
  }

  public async updateCustomer({
    id,
    orgId,
    createdBy,
    data,
  }: {
    id: string;
    orgId: string;
    createdBy: string;
    data: CustomerCreateModel;
  }): Promise<CustomerModel> {
    const updatedCustomer = await this.prismaService.customer.update({
      where: {
        id_orgId: {
          id,
          orgId,
        },
      },
      data: {
        address: data.address,
        birthday: data.birthday ? new Date(data.birthday) : null,
        displayName: data.displayName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
      },
    });

    this.orgActivityLogService.logUpdateCustomer({
      createdBy,
      customerId: updatedCustomer.id,
      orgId,
      data: {
        customerId: updatedCustomer.id,
        customerName:
          updatedCustomer.displayName ||
          updatedCustomer.email ||
          updatedCustomer.phoneNumber,
        updateActions: [],
      },
    });

    return CustomerModel.fromCustomer(updatedCustomer);
  }

  public async getCustomerDetail({
    id,
    orgId,
  }: {
    id: string;
    orgId: string;
  }): Promise<CustomerModel> {
    const customer = await this.prismaService.customer.findUnique({
      where: {
        id_orgId: {
          id,
          orgId,
        },
      },
    });

    return CustomerModel.fromCustomer(customer);
  }

  public async getOrCreateCustomerByUserId({
    userId,
    createdBy,
    orgId,
  }: {
    userId: string;
    createdBy: string;
    orgId: string;
  }): Promise<CustomerModel> {
    const customer = await this.prismaService.customer.findUnique({
      where: {
        userId_orgId: {
          userId,
          orgId,
        },
      },
    });

    if (customer) {
      await this.orgStatisticLogService.increaseTodayReturnCustomerCount(orgId);
      return CustomerModel.fromCustomer(customer);
    }

    const user = await this.usersService.getUserById(userId);
    const userInfo = await this.usersService.getUserInfoById(userId);
    await this.orgStatisticLogService.increaseTodayNewCustomerCount(orgId);
    return this.createCustomer({
      orgId,
      createdBy,
      data: {
        displayName: userInfo.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  }
}
