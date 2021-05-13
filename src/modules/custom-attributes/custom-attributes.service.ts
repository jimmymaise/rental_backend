import { Injectable } from '@nestjs/common';
import { CommonAttributesType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  SellingOrderStatusModel,
  SellingOrderStatusCreateModel,
} from './models';
import { SellingOrderSystemStatusTypes } from './constants/selling-order-system-status-types';

@Injectable()
export class CustomAttributesService {
  constructor(private prismaService: PrismaService) {}

  getAllSystemSellingOrderStatus(): SellingOrderStatusModel[] {
    return SellingOrderSystemStatusTypes;
  }

  async getAllSellingOrderStatusCustomAttributes(
    orgId: string,
  ): Promise<SellingOrderStatusModel[]> {
    const queryResult = await this.prismaService.commonAttributesConfig.findMany(
      {
        where: {
          orgId,
          type: CommonAttributesType.SellingOrderStatus,
          isDeleted: false,
        },
      },
    );

    return queryResult.map((record) =>
      SellingOrderStatusModel.fromCommonAttributesConfig(record),
    );
  }

  async createSellingOrderStatusCustomAttribute(
    orgId: string,
    data: SellingOrderStatusCreateModel,
  ): Promise<SellingOrderStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.create({
      data: SellingOrderStatusCreateModel.toCommonAttributesConfig(orgId, data),
    });

    return SellingOrderStatusModel.fromCommonAttributesConfig(result);
  }

  async updateSellingOrderStatusCustomAttribute(
    id: string,
    orgId: string,
    data: SellingOrderStatusCreateModel,
  ): Promise<SellingOrderStatusModel> {
    const record = await this.prismaService.commonAttributesConfig.findUnique({
      where: { id },
    });

    if (record.orgId !== orgId || record.isDeleted) {
      throw new Error('OrgId not match or this record is deleted');
    }

    const result = await this.prismaService.commonAttributesConfig.update({
      where: {
        id,
      },
      data: SellingOrderStatusCreateModel.toCommonAttributesConfig(orgId, data),
    });

    return SellingOrderStatusModel.fromCommonAttributesConfig(result);
  }

  async deleteSellingOrderStatusCustomAttribute(
    id: string,
    orgId: string,
  ): Promise<SellingOrderStatusModel> {
    const record = await this.prismaService.commonAttributesConfig.findUnique({
      where: { id },
    });

    if (record.orgId !== orgId || record.isDeleted) {
      throw new Error('OrgId not match or this record is deleted');
    }

    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        id,
      },
    });

    return SellingOrderStatusModel.fromCommonAttributesConfig(result);
  }
}
