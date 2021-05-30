import { RentingOrderItem } from '@prisma/client';

import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { ItemDTO } from '../../items/item.dto';
import { RentingOrderItemStatusModel } from '../../custom-attributes/models/renting-order-item-status.model';

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
  public attachedFiles?: StoragePublicDTO[];
  public itemId: string;
  public item?: ItemDTO;
  public status?: string;
  public statusDetail?: RentingOrderItemStatusModel;

  public static fromDatabase(
    data: RentingOrderItem,
    {
      rentingOrderItemStatuses,
    }: { rentingOrderItemStatuses?: RentingOrderItemStatusModel[] } = {
      rentingOrderItemStatuses: [],
    },
  ): RentingOrderItemModel {
    let statusDetail: RentingOrderItemStatusModel;
    if (rentingOrderItemStatuses?.length) {
      statusDetail = rentingOrderItemStatuses.find(
        (status) => status.value === data.status,
      );
    }

    return {
      id: data.id,
      itemId: data.itemId,
      amount: data.amount,
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
    };
  }
}
