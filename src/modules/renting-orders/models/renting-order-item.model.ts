import { RentingOrderItem } from '@prisma/client';

import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { ItemDTO } from '../../items/item.dto';
import { RentingOrderStatusModel } from '../../custom-attributes/models/renting-order-status.model';

export class RentingOrderItemModel {
  public id: string;
  public sku?: string;
  public name?: string;
  public note?: string;
  public amount?: number;
  public quantity?: number;
  public pickupDateTime?: number;
  public returningDateTime?: number;
  public unitPrice?: number;
  public unitPricePerDay?: number;
  public unitPricePerWeek?: number;
  public unitPricePerMonth?: number;
  public images?: StoragePublicDTO[];
  public attachedFiles?: StoragePublicDTO[];
  public itemId: string;
  public item?: ItemDTO;
  public status?: string;
  public statusDetail?: RentingOrderStatusModel;
  public systemStatus?: string;
  public customerUserId?: string;

  public static fromDatabase(
    data: RentingOrderItem,
    {
      rentingOrderStatuses,
    }: { rentingOrderStatuses?: RentingOrderStatusModel[] } = {
      rentingOrderStatuses: [],
    },
  ): RentingOrderItemModel {
    let statusDetail: RentingOrderStatusModel;
    if (rentingOrderStatuses?.length) {
      statusDetail = rentingOrderStatuses.find(
        (status) => status.value === data.status,
      );
    }

    return {
      id: data.id,
      itemId: data.itemId,
      amount: data.amount,
      images: data.images as StoragePublicDTO[],
      attachedFiles: data.attachedFiles as StoragePublicDTO[],
      name: data.name,
      note: data.note,
      pickupDateTime: data.pickupDateTime
        ? data.pickupDateTime.getTime()
        : null,
      quantity: data.quantity,
      returningDateTime: data.returningDateTime
        ? data.returningDateTime.getTime()
        : null,
      sku: data.sku,
      unitPrice: data.unitPrice,
      unitPricePerDay: data.unitPricePerDay,
      unitPricePerWeek: data.unitPricePerWeek,
      unitPricePerMonth: data.unitPricePerMonth,
      statusDetail,
      systemStatus: data.systemStatus,
      customerUserId: data.customerUserId,
    };
  }
}
