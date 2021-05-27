import {
  SellingOrder,
  RentingOrderItem,
  RentingDepositItem,
} from '@prisma/client';

import { RentingOrderItemModel } from './renting-order-item.model';
import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { RentingDepositItemModel } from './renting-deposit-item.model';

export class SellingOrderModel {
  public id: string;
  public orderCustomId: string;
  public totalAmount?: number;
  public note?: string;
  public customerUserId?: string;
  public attachedFiles?: StoragePublicDTO[];
  public status: string;

  public rentingOrderItems?: RentingOrderItemModel[];
  public rentingDepositItems?: RentingDepositItemModel[];

  public createdDate?: number;
  public updatedDate?: number;

  public static fromDatabase(
    data: SellingOrder,
    rentingOrderItems: RentingOrderItem[],
    rentingDepositItems: RentingDepositItem[],
  ): SellingOrderModel {
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
    };
  }
}
