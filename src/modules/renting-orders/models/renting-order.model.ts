import {
  RentingOrder,
  RentingOrderItem,
  RentingDepositItem,
  Customer,
} from '@prisma/client';

import { RentingOrderItemModel } from './renting-order-item.model';
import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { RentingDepositItemModel } from './renting-deposit-item.model';
import { CustomerModel } from '../../customers/models/customer.model';
import { RentingOrderStatusModel } from '../../custom-attributes/models/renting-order-status.model';
import { RentingDepositItemTypeModel } from '../../custom-attributes/models/renting-deposit-item-type.model';
import { RentingDepositItemStatusModel } from '../../custom-attributes/models/renting-deposit-item-status.model';
import { OrganizationSummaryCacheDto } from '@modules/organizations/organizations.dto';

export class RentingOrderModel {
  public id: string;
  public orgId: string;
  public orderCustomId: string;
  public totalAmount?: number;
  public note?: string;
  public customerUserId?: string;
  public customerUser?: CustomerModel;
  public images?: StoragePublicDTO[];
  public attachedFiles?: StoragePublicDTO[];
  public status: string;
  public systemStatus: string;
  public statusDetail?: RentingOrderStatusModel;
  public orgDetail?: OrganizationSummaryCacheDto;

  public rentingOrderItems?: RentingOrderItemModel[];
  public rentingDepositItems?: RentingDepositItemModel[];
  public allowChangeToStatuses?: RentingOrderStatusModel[];

  public createdDate?: number;
  public updatedDate?: number;

  public static fromDatabase({
    data,
    rentingOrderItems,
    rentingDepositItems,
    orgCustomerInfo,
    statuses,
    rentingDepositItemTypes,
    rentingDepositItemStatuses,
  }: {
    data: RentingOrder;
    rentingOrderItems?: RentingOrderItem[];
    rentingDepositItems?: RentingDepositItem[];
    orgCustomerInfo?: Customer;
    statuses?: RentingOrderStatusModel[];
    rentingDepositItemTypes?: RentingDepositItemTypeModel[];
    rentingDepositItemStatuses?: RentingDepositItemStatusModel[];
  }): RentingOrderModel {
    let statusDetail: RentingOrderStatusModel;
    let allowChangeToStatuses: RentingOrderStatusModel[] = [];
    if (statuses?.length) {
      statusDetail = statuses.find((status) => status.value === data.status);
      allowChangeToStatuses = statuses.filter(
        (status) => status.parentAttributeValue === data.status,
      );
    }

    return {
      id: data.id,
      orgId: data.orgId,
      orderCustomId: data.orderCustomId,
      totalAmount: data.totalAmount,
      note: data.note,
      status: data.status,
      images: data.images as StoragePublicDTO[],
      attachedFiles: data.attachedFiles as StoragePublicDTO[],
      customerUserId: data.customerUserId,
      rentingDepositItems: (rentingDepositItems || []).map((depositItem) =>
        RentingDepositItemModel.fromDatabase(depositItem, {
          rentingDepositItemStatuses,
          rentingDepositItemTypes,
        }),
      ),
      rentingOrderItems: (rentingOrderItems || []).map((rentingOrderItem) =>
        RentingOrderItemModel.fromDatabase(rentingOrderItem, {
          rentingOrderStatuses: statuses,
        }),
      ),
      createdDate: data?.createdDate ? data.createdDate.getTime() : null,
      updatedDate: data?.updatedDate ? data.updatedDate.getTime() : null,
      customerUser: orgCustomerInfo
        ? CustomerModel.fromCustomer(orgCustomerInfo)
        : null,
      statusDetail,
      systemStatus: data.systemStatus,
      allowChangeToStatuses,
    };
  }
}
