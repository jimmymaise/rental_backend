import { Injectable } from '@nestjs/common';

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
import { OrgActivityLogService } from '@modules/org-activity-log/org-activity-log.service';
import {
  CommonAttributesType,
  RentingDepositItemSystemStatusType,
  RentingOrderSystemStatusType,
} from '@app/models';

@Injectable()
export class CustomAttributesService {
  constructor(
    private prismaService: PrismaService,
    private orgActivityLogService: OrgActivityLogService,
  ) {}

  // Selling Order Status
  getAllSystemRentingOrderStatus(): RentingOrderStatusModel[] {
    return RentingOrderSystemStatusTypes;
  }

  async getAllRentingOrderStatusCustomAttributes(
    orgId: string,
  ): Promise<RentingOrderStatusModel[]> {
    const queryResult =
      await this.prismaService.commonAttributesConfig.findMany({
        where: {
          orgId,
          type: CommonAttributesType.RentingOrderStatus,
        },
        orderBy: {
          order: 'asc',
        },
      });

    return queryResult.map((record) =>
      RentingOrderStatusModel.fromCommonAttributesConfig(record),
    );
  }

  async getRentingOrderStatusCustomAttributeDetail(
    orgId: string,
    value: string,
  ): Promise<RentingOrderStatusModel> {
    const record = await this.prismaService.commonAttributesConfig.findUnique({
      where: {
        orgId_type_value: {
          value,
          type: CommonAttributesType.RentingOrderStatus,
          orgId,
        },
      },
    });

    return RentingOrderStatusModel.fromCommonAttributesConfig(record);
  }

  async createRentingOrderStatusCustomAttribute(
    orgId: string,
    userId: string,
    data: RentingOrderStatusCreateModel,
  ): Promise<RentingOrderStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.create({
      data: {
        ...RentingOrderStatusCreateModel.toCommonAttributesConfig(
          orgId,
          userId,
          data,
        ),
        createdBy: userId,
      },
    });

    await this.orgActivityLogService.logCreateRentingOrderStatus({
      createdBy: userId,
      data: {
        name: result.label,
        value: result.value,
      },
      orgId,
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

    await this.orgActivityLogService.logUpdateRentingOrderStatus({
      createdBy: userId,
      data: {
        name: result.label,
        value: result.value,
        updateActions: [],
      },
      orgId,
    });

    return RentingOrderStatusModel.fromCommonAttributesConfig(result);
  }

  async deleteRentingOrderStatusCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    type: string,
  ): Promise<RentingOrderStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        orgId_type_value: { orgId, value, type: type as CommonAttributesType },
      },
    });

    await this.orgActivityLogService.logDeleteRentingOrderStatus({
      createdBy: userId,
      data: {
        name: result.label,
        value: result.value,
      },
      orgId,
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
    const queryResult =
      await this.prismaService.commonAttributesConfig.findMany({
        where: {
          orgId,
          type: CommonAttributesType.RentingDepositItemStatus,
        },
        orderBy: {
          order: 'asc',
        },
      });

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
      data: {
        ...RentingDepositItemStatusCreateModel.toCommonAttributesConfig(
          orgId,
          userId,
          data,
        ),
        createdBy: userId,
      },
    });

    await this.orgActivityLogService.logCreateDepositItemStatus({
      createdBy: userId,
      data: {
        name: result.label,
        value: result.value,
      },
      orgId,
    });

    return RentingDepositItemStatusModel.fromCommonAttributesConfig(result);
  }

  async updateRentingDepositItemStatusCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    data: RentingDepositItemStatusCreateModel,
  ): Promise<RentingDepositItemStatusModel> {
    const updatedData =
      RentingDepositItemStatusCreateModel.toCommonAttributesConfig(
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

    await this.orgActivityLogService.logUpdateDepositItemStatus({
      createdBy: userId,
      data: {
        name: result.label,
        value: result.value,
        updateActions: [],
      },
      orgId,
    });

    return RentingDepositItemStatusModel.fromCommonAttributesConfig(result);
  }

  async deleteRentingDepositItemStatusCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    type: string,
  ): Promise<RentingDepositItemStatusModel> {
    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        orgId_type_value: { orgId, value, type: type as CommonAttributesType },
      },
    });

    await this.orgActivityLogService.logDeleteDepositItemStatus({
      createdBy: userId,
      data: {
        name: result.label,
        value: result.value,
      },
      orgId,
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
    const queryResult =
      await this.prismaService.commonAttributesConfig.findMany({
        where: {
          orgId,
          type: CommonAttributesType.RentingDepositItemType,
        },
        orderBy: {
          order: 'asc',
        },
      });

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
      data: {
        ...RentingDepositItemTypeCreateModel.toCommonAttributesConfig(
          orgId,
          userId,
          data,
        ),
        createdBy: userId,
      },
    });

    await this.orgActivityLogService.logCreateDepositType({
      createdBy: userId,
      data: {
        name: result.label,
        value: result.value,
      },
      orgId,
    });

    return RentingDepositItemTypeModel.fromCommonAttributesConfig(result);
  }

  async updateRentingDepositItemTypeCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    data: RentingDepositItemTypeCreateModel,
  ): Promise<RentingDepositItemTypeModel> {
    const updatedData =
      RentingDepositItemTypeCreateModel.toCommonAttributesConfig(
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

    await this.orgActivityLogService.logUpdateDepositType({
      createdBy: userId,
      data: {
        name: result.label,
        value: result.value,
        updateActions: [],
      },
      orgId,
    });

    return RentingDepositItemTypeModel.fromCommonAttributesConfig(result);
  }

  async deleteRentingDepositItemTypeCustomAttribute(
    value: string,
    orgId: string,
    userId: string,
    type: string,
  ): Promise<RentingDepositItemTypeModel> {
    const result = await this.prismaService.commonAttributesConfig.delete({
      where: {
        orgId_type_value: { orgId, value, type: type as CommonAttributesType },
      },
    });

    await this.orgActivityLogService.logDeleteDepositType({
      createdBy: userId,
      data: {
        name: result.label,
        value: result.value,
      },
      orgId,
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
