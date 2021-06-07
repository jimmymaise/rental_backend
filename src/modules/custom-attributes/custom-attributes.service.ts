import { Injectable } from '@nestjs/common';
import {
  CommonAttributesType,
  RentingDepositItemSystemStatusType,
  RentingOrderSystemStatusType,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  RentingOrderStatusModel,
  RentingOrderStatusCreateModel,
  RentingDepositItemStatusCreateModel,
  RentingDepositItemStatusModel,
  RentingDepositItemTypeCreateModel,
  RentingDepositItemTypeModel,
} from './models';
import { RentingOrderSystemStatusTypes } from './constants/renting-order-system-status-types';
import { RentingDepositItemSystemStatusTypes } from './constants/renting-deposit-item-system-status-types';
import { RentingDepositItemSystemTypeTypes } from './constants/renting-deposit-item-system-type-types';

@Injectable()
export class CustomAttributesService {
  constructor(private prismaService: PrismaService) {}

  // Selling Order Status
  getAllSystemRentingOrderStatus(): RentingOrderStatusModel[] {
    return RentingOrderSystemStatusTypes;
  }

  async getAllRentingOrderStatusCustomAttributes(
    orgId: string,
  ): Promise<RentingOrderStatusModel[]> {
    const queryResult = await this.prismaService.commonAttributesConfig.findMany(
      {
        where: {
          orgId,
          type: CommonAttributesType.RentingOrderStatus,
        },
      },
    );

    return queryResult.map((record) =>
      RentingOrderStatusModel.fromCommonAttributesConfig(record),
    );
  }

  async createRentingOrderStatusCustomAttribute(
    orgId: string,
    userId: string,
    data: RentingOrderStatusCreateModel,
  ): Promise<RentingOrderStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.create({
      data: RentingOrderStatusCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
    });

    return RentingOrderStatusModel.fromCommonAttributesConfig(result);
  }

  async updateRentingOrderStatusCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    data: RentingOrderStatusCreateModel,
  ): Promise<RentingOrderStatusModel> {
    const updatedData = RentingOrderStatusCreateModel.toCommonAttributesConfig(
      orgId,
      userId,
      data,
    );
    const result = await this.prismaService.commonAttributesConfig.update({
      where: {
        orgId_type_value: {
          orgId,
          value,
          type: CommonAttributesType.RentingOrderStatus,
        },
      },
      data: {
        label: updatedData.label,
        customConfigs: updatedData.customConfigs,
        isDisabled: updatedData.isDisabled,
        description: updatedData.description,
        mapWithSystemValue: updatedData.mapWithSystemValue,
        order: updatedData.order,
      },
    });

    return RentingOrderStatusModel.fromCommonAttributesConfig(result);
  }

  async deleteRentingOrderStatusCustomAttribute(
    value: string,
    orgId: string,
    type: string,
  ): Promise<RentingOrderStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        orgId_type_value: { orgId, value, type: type as CommonAttributesType },
      },
    });

    return RentingOrderStatusModel.fromCommonAttributesConfig(result);
  }

  // Renting Deposit Item Status
  getAllSystemRentingDepositItemStatus(): RentingDepositItemStatusModel[] {
    return RentingDepositItemSystemStatusTypes;
  }

  async getAllRentingDepositItemStatusCustomAttributes(
    orgId: string,
  ): Promise<RentingDepositItemStatusModel[]> {
    const queryResult = await this.prismaService.commonAttributesConfig.findMany(
      {
        where: {
          orgId,
          type: CommonAttributesType.RentingDepositItemStatus,
        },
      },
    );

    return queryResult.map((record) =>
      RentingDepositItemStatusModel.fromCommonAttributesConfig(record),
    );
  }

  async createRentingDepositItemStatusCustomAttribute(
    orgId: string,
    userId: string,
    data: RentingDepositItemStatusCreateModel,
  ): Promise<RentingDepositItemStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.create({
      data: RentingDepositItemStatusCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
    });

    return RentingDepositItemStatusModel.fromCommonAttributesConfig(result);
  }

  async updateRentingDepositItemStatusCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    data: RentingDepositItemStatusCreateModel,
  ): Promise<RentingDepositItemStatusModel> {
    const updatedData = RentingDepositItemStatusCreateModel.toCommonAttributesConfig(
      orgId,
      userId,
      data,
    );
    const result = await this.prismaService.commonAttributesConfig.update({
      where: {
        orgId_type_value: {
          orgId,
          value,
          type: CommonAttributesType.RentingDepositItemStatus,
        },
      },
      data: {
        label: updatedData.label,
        customConfigs: updatedData.customConfigs,
        isDisabled: updatedData.isDisabled,
        description: updatedData.description,
        mapWithSystemValue: updatedData.mapWithSystemValue,
        order: updatedData.order,
      },
    });

    return RentingDepositItemStatusModel.fromCommonAttributesConfig(result);
  }

  async deleteRentingDepositItemStatusCustomAttribute(
    value: string,
    orgId: string,
    type: string,
  ): Promise<RentingDepositItemStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        orgId_type_value: { orgId, value, type: type as CommonAttributesType },
      },
    });

    return RentingDepositItemStatusModel.fromCommonAttributesConfig(result);
  }

  // Renting Deposit Item Type
  getAllSystemRentingDepositItemType(): RentingDepositItemTypeModel[] {
    return RentingDepositItemSystemTypeTypes;
  }

  async getAllRentingDepositItemTypeCustomAttributes(
    orgId: string,
  ): Promise<RentingDepositItemTypeModel[]> {
    const queryResult = await this.prismaService.commonAttributesConfig.findMany(
      {
        where: {
          orgId,
          type: CommonAttributesType.RentingDepositItemType,
        },
      },
    );

    return queryResult.map((record) =>
      RentingDepositItemTypeModel.fromCommonAttributesConfig(record),
    );
  }

  async createRentingDepositItemTypeCustomAttribute(
    orgId: string,
    userId: string,
    data: RentingDepositItemTypeCreateModel,
  ): Promise<RentingDepositItemTypeModel> {
    const result = await this.prismaService.commonAttributesConfig.create({
      data: RentingDepositItemTypeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
    });

    return RentingDepositItemTypeModel.fromCommonAttributesConfig(result);
  }

  async updateRentingDepositItemTypeCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    data: RentingDepositItemTypeCreateModel,
  ): Promise<RentingDepositItemTypeModel> {
    const updatedData = RentingDepositItemTypeCreateModel.toCommonAttributesConfig(
      orgId,
      userId,
      data,
    );
    const result = await this.prismaService.commonAttributesConfig.update({
      where: {
        orgId_type_value: {
          orgId,
          value,
          type: CommonAttributesType.RentingDepositItemType,
        },
      },
      data: {
        label: updatedData.label,
        customConfigs: updatedData.customConfigs,
        isDisabled: updatedData.isDisabled,
        description: updatedData.description,
        mapWithSystemValue: updatedData.mapWithSystemValue,
        order: updatedData.order,
      },
    });

    return RentingDepositItemTypeModel.fromCommonAttributesConfig(result);
  }

  async deleteRentingDepositItemTypeCustomAttribute(
    value: string,
    orgId: string,
    type: string,
  ): Promise<RentingDepositItemTypeModel> {
    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        orgId_type_value: { orgId, value, type: type as CommonAttributesType },
      },
    });

    return RentingDepositItemTypeModel.fromCommonAttributesConfig(result);
  }

  async getListCustomRentingOrderStatus(
    orgId: string,
    systemStatus: RentingOrderSystemStatusType,
  ): Promise<RentingOrderStatusModel[]> {
    const result = await this.prismaService.commonAttributesConfig.findMany({
      where: {
        orgId,
        type: CommonAttributesType.RentingOrderStatus,
        mapWithSystemValue: systemStatus,
      },
    });

    if (!result?.length) {
      throw new Error(
        `getListCustomRentingOrderStatus: Default of ${systemStatus} not existing`,
      );
    }

    return result.map((item) =>
      RentingOrderStatusModel.fromCommonAttributesConfig(item),
    );
  }

  async getListCustomRentingDepositItemStatus(
    orgId: string,
    systemStatus: RentingDepositItemSystemStatusType,
  ): Promise<RentingDepositItemStatusModel[]> {
    const result = await this.prismaService.commonAttributesConfig.findMany({
      where: {
        orgId,
        type: CommonAttributesType.RentingDepositItemStatus,
        mapWithSystemValue: systemStatus,
      },
    });

    if (!result?.length) {
      throw new Error(
        `getListCustomRentingDepositItemStatus: Default of ${systemStatus} not existing`,
      );
    }

    return result.map((item) =>
      RentingDepositItemStatusModel.fromCommonAttributesConfig(item),
    );
  }

  async getListCustomRentingDepositItemType(
    orgId: string,
  ): Promise<RentingDepositItemTypeModel[]> {
    const result = await this.prismaService.commonAttributesConfig.findMany({
      where: {
        orgId,
        type: CommonAttributesType.RentingDepositItemType,
      },
    });

    if (!result?.length) {
      throw new Error(`getListCustomRentingDepositItemType not existing`);
    }

    return result.map((item) =>
      RentingDepositItemTypeModel.fromCommonAttributesConfig(item),
    );
  }
}
