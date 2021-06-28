import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  RentingOrderActivityLogModel,
  BaseOrgActivityLogModel,
  ItemActivityLogModel,
  CustomerActivityLogModel,
  EmployeeActivityLogModel,
} from './models';

@Injectable()
export class BaseOrgActivityLogService {
  constructor(private prismaService: PrismaService) {}

  public async addRentingOrderActivityLog(
    data: RentingOrderActivityLogModel,
  ): Promise<RentingOrderActivityLogModel> {
    const dbResponse = await this.prismaService.orgActivityLog.create({
      data: {
        type: data.type,
        createdByUser: {
          connect: {
            id: data.createdBy,
          },
        },
        org: {
          connect: {
            id: data.orgId,
          },
        },
        data: data.data,
        rentingOrderOrgActivityLog: {
          create: {
            rentingOrderId: data.rentingOrderId,
          },
        },
      },
    });

    return RentingOrderActivityLogModel.fromDatabase(dbResponse);
  }

  public async addItemActivityLog(
    data: ItemActivityLogModel,
  ): Promise<ItemActivityLogModel> {
    const dbResponse = await this.prismaService.orgActivityLog.create({
      data: {
        type: data.type,
        createdByUser: {
          connect: {
            id: data.createdBy,
          },
        },
        org: {
          connect: {
            id: data.orgId,
          },
        },
        data: data.data,
        itemOrgActivityLog: {
          create: {
            itemId: data.itemId,
          },
        },
      },
    });

    return ItemActivityLogModel.fromDatabase(dbResponse);
  }

  public async addCustomerActivityLog(
    data: CustomerActivityLogModel,
  ): Promise<CustomerActivityLogModel> {
    const dbResponse = await this.prismaService.orgActivityLog.create({
      data: {
        type: data.type,
        createdByUser: {
          connect: {
            id: data.createdBy,
          },
        },
        org: {
          connect: {
            id: data.orgId,
          },
        },
        data: data.data,
        customerOrgActivityLog: {
          create: {
            customerId: data.customerId,
          },
        },
      },
    });

    return CustomerActivityLogModel.fromDatabase(dbResponse);
  }

  public async addEmployeeActivityLog(
    data: EmployeeActivityLogModel,
  ): Promise<EmployeeActivityLogModel> {
    const dbResponse = await this.prismaService.orgActivityLog.create({
      data: {
        type: data.type,
        createdByUser: {
          connect: {
            id: data.createdBy,
          },
        },
        org: {
          connect: {
            id: data.orgId,
          },
        },
        data: data.data,
        employeeOrgActivityLog: {
          create: {
            employeeId: data.employeeId,
          },
        },
      },
    });

    return EmployeeActivityLogModel.fromDatabase(dbResponse);
  }

  public async addActivityLog(
    data: BaseOrgActivityLogModel,
  ): Promise<BaseOrgActivityLogModel> {
    const dbResponse = await this.prismaService.orgActivityLog.create({
      data: {
        type: data.type,
        createdByUser: {
          connect: {
            id: data.createdBy,
          },
        },
        org: {
          connect: {
            id: data.orgId,
          },
        },
        data: data.data,
      },
    });

    return CustomerActivityLogModel.fromDatabase(dbResponse);
  }

  public async getAllOrgActivityLog(
    orgId: string,
  ): Promise<BaseOrgActivityLogModel[]> {
    const dbResponse = await this.prismaService.orgActivityLog.findMany({
      where: {
        orgId,
      },
    });

    return dbResponse.map((dbItem) =>
      BaseOrgActivityLogModel.fromDatabase(dbItem),
    );
  }
}
