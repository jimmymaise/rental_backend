import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  RentingOrderActivityLogModel,
  BaseOrgActivityLogModel,
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
        data: RentingOrderActivityLogModel.toDatabaseDataJSON(data),
        rentingOrderOrgActivityLog: {
          create: {
            rentingOrderId: data.rentingOrderId,
          },
        },
      },
      include: {
        rentingOrderOrgActivityLog: true,
      },
    });

    return RentingOrderActivityLogModel.fromDatabase(dbResponse);
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
