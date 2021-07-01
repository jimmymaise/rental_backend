import { Injectable } from '@nestjs/common';

import { BaseOrgActivityLogService } from './base-org-activity-log.service';
import {
  CreateRentingOrderActivityLogModel,
  UpdateRentingOrderActivityLogModel,
  ChangeRentingOrderStatusActivityLogModel,
  DeleteRentingOrderActivityLogModel,
  CreateItemActivityLogModel,
  CreateCategoryActivityLogModel,
  CreateCustomerActivityLogModel,
  CreateDamagesPayForRentingOrderItemActivityLogModel,
  CreateDamagesRefundForRentingOrderItemActivityLogModel,
  CreatePayForRentingOrderActivityLogModel,
  CreateRefundForRentingOrderActivityLogModel,
  CreateRoleActivityLogModel,
  DeleteCategoryActivityLogModel,
  DeleteItemActivityLogModel,
  UpdateCategoryActivityLogModel,
  UpdateCustomerActivityLogModel,
  UpdateItemActivityLogModel,
  UpdateOrgInformationActivityLogModel,
  UpdateRoleActivityLogModel,
  DeleteRoleActivityLogModel,
  AddEmployeeActivityLogModel,
  UpdateEmployeeActivityLogModel,
  RemoveEmployeeActivityLogModel,
  CreateCustomAttributeActivityLogModel,
  UpdateCustomAttributeActivityLogModel,
  DeleteCustomAttributeActivityLogModel,
} from './models';
import { OrgActivityLogType } from './constants/org-activity-log-type.enum';

@Injectable()
export class OrgActivityLogService {
  constructor(private baseOrgActivityLogService: BaseOrgActivityLogService) {}

  // Renting Order Activity Logs
  public async logCreateNewRentingOrder(
    data: CreateRentingOrderActivityLogModel,
  ): Promise<CreateRentingOrderActivityLogModel> {
    return this.baseOrgActivityLogService.addRentingOrderActivityLog({
      ...data,
      type: OrgActivityLogType.CreateRentingOrder,
    });
  }

  public async logUpdateRentingOrder(
    data: UpdateRentingOrderActivityLogModel,
  ): Promise<UpdateRentingOrderActivityLogModel> {
    return this.baseOrgActivityLogService.addRentingOrderActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateRentingOrder,
    });
  }

  public async logChangeRentingOrderStatus(
    data: ChangeRentingOrderStatusActivityLogModel,
  ): Promise<ChangeRentingOrderStatusActivityLogModel> {
    return this.baseOrgActivityLogService.addRentingOrderActivityLog({
      ...data,
      type: OrgActivityLogType.ChangeStatusRentingOrder,
    });
  }

  public async logDeleteRentingOrder(
    data: DeleteRentingOrderActivityLogModel,
  ): Promise<DeleteRentingOrderActivityLogModel> {
    return this.baseOrgActivityLogService.addRentingOrderActivityLog({
      ...data,
      type: OrgActivityLogType.DeleteRentingOrder,
    });
  }

  // Item
  public async logCreateNewItem(
    data: CreateItemActivityLogModel,
  ): Promise<CreateItemActivityLogModel> {
    return this.baseOrgActivityLogService.addItemActivityLog({
      ...data,
      type: OrgActivityLogType.CreateItem,
    });
  }

  public async logUpdateItem(
    data: UpdateItemActivityLogModel,
  ): Promise<UpdateItemActivityLogModel> {
    return this.baseOrgActivityLogService.addItemActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateItem,
    });
  }

  public async logDeleteItem(
    data: DeleteItemActivityLogModel,
  ): Promise<DeleteItemActivityLogModel> {
    return this.baseOrgActivityLogService.addItemActivityLog({
      ...data,
      type: OrgActivityLogType.DeleteItem,
    });
  }

  // Customer
  public async logCreateCustomer(
    data: CreateCustomerActivityLogModel,
  ): Promise<CreateCustomerActivityLogModel> {
    return this.baseOrgActivityLogService.addCustomerActivityLog({
      ...data,
      type: OrgActivityLogType.CreateCustomer,
    });
  }

  public async logUpdateCustomer(
    data: UpdateCustomerActivityLogModel,
  ): Promise<UpdateCustomerActivityLogModel> {
    return this.baseOrgActivityLogService.addCustomerActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateCustomer,
    });
  }

  // Employee
  public async logAddEmployee(
    data: AddEmployeeActivityLogModel,
  ): Promise<AddEmployeeActivityLogModel> {
    return this.baseOrgActivityLogService.addEmployeeActivityLog({
      ...data,
      type: OrgActivityLogType.AddEmployee,
    });
  }

  public async logUpdateEmployee(
    data: UpdateEmployeeActivityLogModel,
  ): Promise<UpdateEmployeeActivityLogModel> {
    return this.baseOrgActivityLogService.addEmployeeActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateEmployee,
    });
  }

  public async logRemoveEmployee(
    data: RemoveEmployeeActivityLogModel,
  ): Promise<RemoveEmployeeActivityLogModel> {
    return this.baseOrgActivityLogService.addEmployeeActivityLog({
      ...data,
      type: OrgActivityLogType.RemoveEmployee,
    });
  }

  // Role
  public async logCreateRole(
    data: CreateRoleActivityLogModel,
  ): Promise<CreateRoleActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.CreateRole,
    });
  }

  public async logUpdateRole(
    data: UpdateRoleActivityLogModel,
  ): Promise<UpdateRoleActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateRole,
    });
  }

  public async logDeleteRole(
    data: DeleteRoleActivityLogModel,
  ): Promise<DeleteRoleActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.DeleteRole,
    });
  }

  // Update Org Information
  public async logUpdateOrgInformation(
    data: UpdateOrgInformationActivityLogModel,
  ): Promise<UpdateOrgInformationActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateOrgInformation,
    });
  }

  // Category
  public async logCreateCategory(
    data: CreateCategoryActivityLogModel,
  ): Promise<CreateCategoryActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.AddCategory,
    });
  }

  public async logUpdateCategory(
    data: UpdateCategoryActivityLogModel,
  ): Promise<UpdateCategoryActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateCategory,
    });
  }

  public async logDeleteCategory(
    data: DeleteCategoryActivityLogModel,
  ): Promise<DeleteCategoryActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.DeleteCategory,
    });
  }

  // Renting Order Payment
  public async logCreatePayForRenting(
    data: CreatePayForRentingOrderActivityLogModel,
  ): Promise<CreatePayForRentingOrderActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.CreatePayForRentingOrder,
    });
  }

  public async logCreateRefundForRenting(
    data: CreateRefundForRentingOrderActivityLogModel,
  ): Promise<CreateRefundForRentingOrderActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.CreateRefundForRentingOrder,
    });
  }

  // Item Damages Payment
  public async logCreateDamagesPayForRentingItemOrder(
    data: CreateDamagesPayForRentingOrderItemActivityLogModel,
  ): Promise<CreateDamagesPayForRentingOrderItemActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.CreateDamagesPayForRentingItemOrder,
    });
  }

  public async logCreateDamagesRefundForRentingItemOrder(
    data: CreateDamagesRefundForRentingOrderItemActivityLogModel,
  ): Promise<CreateDamagesRefundForRentingOrderItemActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.CreateDamagesRefundForRentingItemOrder,
    });
  }

  // Custom Attribute
  // RentingOrderStatus
  public async logCreateRentingOrderStatus(
    data: CreateCustomAttributeActivityLogModel,
  ): Promise<CreateCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.CreateRentingOrderStatus,
    });
  }

  public async logUpdateRentingOrderStatus(
    data: UpdateCustomAttributeActivityLogModel,
  ): Promise<UpdateCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateRentingOrderStatus,
    });
  }

  public async logDeleteRentingOrderStatus(
    data: DeleteCustomAttributeActivityLogModel,
  ): Promise<DeleteCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.DeleteRentingOrderStatus,
    });
  }

  // DepositItemStatus
  public async logCreateDepositItemStatus(
    data: CreateCustomAttributeActivityLogModel,
  ): Promise<CreateCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.CreateDepositItemStatus,
    });
  }

  public async logUpdateDepositItemStatus(
    data: UpdateCustomAttributeActivityLogModel,
  ): Promise<UpdateCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateDepositItemStatus,
    });
  }

  public async logDeleteDepositItemStatus(
    data: DeleteCustomAttributeActivityLogModel,
  ): Promise<DeleteCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.DeleteDepositItemStatus,
    });
  }

  // DepositType
  public async logCreateDepositType(
    data: CreateCustomAttributeActivityLogModel,
  ): Promise<CreateCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.CreateDepositType,
    });
  }

  public async logUpdateDepositType(
    data: UpdateCustomAttributeActivityLogModel,
  ): Promise<UpdateCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.UpdateDepositType,
    });
  }

  public async logDeleteDepositType(
    data: DeleteCustomAttributeActivityLogModel,
  ): Promise<DeleteCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.DeleteDepositType,
    });
  }

  // PaymentMethod
  public async logCreatePaymentMethod(
    data: CreateCustomAttributeActivityLogModel,
  ): Promise<CreateCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.CreatePaymentMethod,
    });
  }

  public async logUpdatePaymentMethod(
    data: UpdateCustomAttributeActivityLogModel,
  ): Promise<UpdateCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.UpdatePaymentMethod,
    });
  }

  public async logDeletePaymentMethod(
    data: DeleteCustomAttributeActivityLogModel,
  ): Promise<DeleteCustomAttributeActivityLogModel> {
    return this.baseOrgActivityLogService.addActivityLog({
      ...data,
      type: OrgActivityLogType.DeletePaymentMethod,
    });
  }
}
