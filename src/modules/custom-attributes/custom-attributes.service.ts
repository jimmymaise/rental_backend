import { Injectable } from '@nestjs/common';
import { CommonAttributesType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  SellingOrderStatusModel,
  SellingOrderStatusCreateModel,
  RentingOrderItemStatusModel,
  RentingOrderItemStatusCreateModel,
  RentingDepositItemStatusCreateModel,
  RentingDepositItemStatusModel,
} from './models';
import { SellingOrderSystemStatusTypes } from './constants/selling-order-system-status-types';
import { RentingOrderItemStatusTypes } from './constants/renting-order-item-system-status-types';
import { RentingDepositItemSystemStatusTypes } from './constants/renting-deposit-item-system-status-types';

@Injectable()
export class CustomAttributesService {
  constructor(private prismaService: PrismaService) {}

  // Selling Order Status
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
        },
      },
    );

    return queryResult.map((record) =>
      SellingOrderStatusModel.fromCommonAttributesConfig(record),
    );
  }

  async createSellingOrderStatusCustomAttribute(
    orgId: string,
    userId: string,
    data: SellingOrderStatusCreateModel,
  ): Promise<SellingOrderStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.create({
      data: SellingOrderStatusCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
    });

    return SellingOrderStatusModel.fromCommonAttributesConfig(result);
  }

  async updateSellingOrderStatusCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    data: SellingOrderStatusCreateModel,
  ): Promise<SellingOrderStatusModel> {
    const updatedData = SellingOrderStatusCreateModel.toCommonAttributesConfig(
      orgId,
      userId,
      data,
    );
    const result = await this.prismaService.commonAttributesConfig.update({
      where: {
        orgId_type_value: {
          orgId,
          value,
          type: CommonAttributesType.SellingOrderStatus,
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

    return SellingOrderStatusModel.fromCommonAttributesConfig(result);
  }

  async deleteSellingOrderStatusCustomAttribute(
    value: string,
    orgId: string,
    type: string,
  ): Promise<SellingOrderStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        orgId_type_value: { orgId, value, type: type as CommonAttributesType },
      },
    });

    return SellingOrderStatusModel.fromCommonAttributesConfig(result);
  }

  // Renting Order Item Status
  getAllSystemRentingOrderItemStatus(): RentingOrderItemStatusModel[] {
    return RentingOrderItemStatusTypes;
  }

  async getAllRentingOrderItemStatusCustomAttributes(
    orgId: string,
  ): Promise<RentingOrderItemStatusModel[]> {
    const queryResult = await this.prismaService.commonAttributesConfig.findMany(
      {
        where: {
          orgId,
          type: CommonAttributesType.RentingOrderItemStatus,
        },
      },
    );

    return queryResult.map((record) =>
      RentingOrderItemStatusModel.fromCommonAttributesConfig(record),
    );
  }

  async createRentingOrderItemStatusCustomAttribute(
    orgId: string,
    userId: string,
    data: RentingOrderItemStatusCreateModel,
  ): Promise<RentingOrderItemStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.create({
      data: RentingOrderItemStatusCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        data,
      ),
    });

    return RentingOrderItemStatusModel.fromCommonAttributesConfig(result);
  }

  async updateRentingOrderItemStatusCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    data: RentingOrderItemStatusCreateModel,
  ): Promise<RentingOrderItemStatusModel> {
    const updatedData = RentingOrderItemStatusCreateModel.toCommonAttributesConfig(
      orgId,
      userId,
      data,
    );
    const result = await this.prismaService.commonAttributesConfig.update({
      where: {
        orgId_type_value: {
          orgId,
          value,
          type: CommonAttributesType.RentingOrderItemStatus,
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

    return RentingOrderItemStatusModel.fromCommonAttributesConfig(result);
  }

  async deleteRentingOrderItemStatusCustomAttribute(
    value: string,
    orgId: string,
    type: string,
  ): Promise<RentingOrderItemStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        orgId_type_value: { orgId, value, type: type as CommonAttributesType },
      },
    });

    return RentingOrderItemStatusModel.fromCommonAttributesConfig(result);
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
}
