import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  RentingOrderActivityLogModel,
  BaseOrgActivityLogModel,
  ItemActivityLogModel,
  CustomerActivityLogModel,
  EmployeeActivityLogModel,
} from './models';
import { OrgActivityLogType } from './constants';
import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';
import { UsersService } from '../users/users.service';
import { OffsetPaginationDTO } from '@app/models';

@Injectable()
export class BaseOrgActivityLogService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

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

  public async getOrgActivityLogWithOffsetPaging(
    orgId: string,
    {
      pageSize,
      offset,
      type,
    }: {
      pageSize: number;
      offset?: any;
      type?: OrgActivityLogType;
    },
  ): Promise<OffsetPaginationDTO<BaseOrgActivityLogModel>> {
    const whereQuery: any = {
      orgId,
    };

    if (type) {
      whereQuery.type = type;
    }

    const pagingHandler = new OffsetPagingHandler(
      whereQuery,
      pageSize,
      {
        createdDate: 'desc',
      },
      this.prismaService,
      'orgActivityLog',
    );

    const dbResponse = await pagingHandler.getPage(offset);
    const items = [];

    for (let i = 0; i < dbResponse.items.length; i++) {
      const dbItem = dbResponse.items[i];
      const createdByDetail = await this.usersService.getUserDetailData(
        dbItem.createdBy,
      );
      items.push(BaseOrgActivityLogModel.fromDatabase(dbItem, createdByDetail));
    }

    return {
      ...dbResponse,
      items,
    };
  }

  public async getAllOrgActivityLog(
    orgId: string,
  ): Promise<BaseOrgActivityLogModel[]> {
    const dbResponse = await this.prismaService.orgActivityLog.findMany({
      where: {
        orgId,
      },
      orderBy: {
        createdDate: 'desc',
      },
    });

    return dbResponse.map((dbItem) =>
      BaseOrgActivityLogModel.fromDatabase(dbItem),
    );
  }
}
