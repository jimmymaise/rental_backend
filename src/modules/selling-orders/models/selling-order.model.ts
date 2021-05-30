import {
  SellingOrder,
  RentingOrderItem,
  RentingDepositItem,
  Customer,
} from '@prisma/client';

import { RentingOrderItemModel } from './renting-order-item.model';
import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { RentingDepositItemModel } from './renting-deposit-item.model';
import { CustomerModel } from '../../customers/models/customer.model';
import { SellingOrderStatusModel } from '../../custom-attributes/models/selling-order-status.model';

export class SellingOrderModel {
  public id: string;
  public orderCustomId: string;
  public totalAmount?: number;
  public note?: string;
  public customerUserId?: string;
  public customerUser?: CustomerModel;
  public attachedFiles?: StoragePublicDTO[];
  public status: string;
  public statusDetail?: SellingOrderStatusModel;

  public rentingOrderItems?: RentingOrderItemModel[];
  public rentingDepositItems?: RentingDepositItemModel[];

  public createdDate?: number;
  public updatedDate?: number;

  public static fromDatabase({
    data,
    rentingOrderItems,
    rentingDepositItems,
    orgCustomerInfo,
    statuses,
  }: {
    data: SellingOrder;
    rentingOrderItems?: RentingOrderItem[];
    rentingDepositItems?: RentingDepositItem[];
    orgCustomerInfo?: Customer;
    statuses?: SellingOrderStatusModel[];
  }): SellingOrderModel {
    let statusDetail: SellingOrderStatusModel;
    if (statuses?.length) {
      statusDetail = statuses.find((status) => status.value === data.status);
    }

    return {
      id: data.id,
      orderCustomId: data.orderCustomId,
      totalAmount: data.totalAmount,
      note: data.note,
      status: data.status,
      attachedFiles: data.attachedFiles as StoragePublicDTO[],
      customerUserId: data.customerUserId,
      rentingDepositItems: (rentingDepositItems || []).map((depositItem) =>
        RentingDepositItemModel.fromDatabase(depositItem),
      ),
      rentingOrderItems: (rentingOrderItems || []).map((rentingOrderItem) =>
        RentingOrderItemModel.fromDatabase(rentingOrderItem),
      ),
      createdDate: data?.createdDate ? data.createdDate.getTime() : null,
      updatedDate: data?.updatedDate ? data.updatedDate.getTime() : null,
      customerUser: orgCustomerInfo
        ? CustomerModel.fromCustomer(orgCustomerInfo)
        : null,
      statusDetail,
    };
  }
}
