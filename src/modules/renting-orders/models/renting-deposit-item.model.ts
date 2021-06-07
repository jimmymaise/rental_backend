import { RentingDepositItem } from '@prisma/client';
import { StoragePublicDTO } from '../../storages/storage-public.dto';
import { RentingDepositItemTypeModel } from '../../custom-attributes/models/renting-deposit-item-type.model';
import { RentingDepositItemStatusModel } from '../../custom-attributes/models/renting-deposit-item-status.model';

export class RentingDepositItemModel {
  public id: string;
  public type: string;
  public note?: string;
  public valueAmount?: number;
  public attachedFiles?: StoragePublicDTO[];
  public status?: string;
  public typeDetail?: RentingDepositItemTypeModel;
  public statusDetail?: RentingDepositItemStatusModel;

  public static fromDatabase(
    data: RentingDepositItem,
    {
      rentingDepositItemStatuses,
      rentingDepositItemTypes,
    }: {
      rentingDepositItemTypes: RentingDepositItemTypeModel[];
      rentingDepositItemStatuses: RentingDepositItemStatusModel[];
    } = { rentingDepositItemStatuses: [], rentingDepositItemTypes: [] },
  ): RentingDepositItemModel {
    let typeDetail: RentingDepositItemTypeModel;
    let statusDetail: RentingDepositItemStatusModel;

    if (rentingDepositItemStatuses?.length) {
      statusDetail = rentingDepositItemStatuses.find(
        (status) => status.value === data.status,
      );
    }

    if (rentingDepositItemTypes?.length) {
      typeDetail = rentingDepositItemTypes.find(
        (type) => type.value === data.type,
      );
    }

    return {
      id: data.id,
      type: data.type,
      status: data.status,
      attachedFiles: data.attachedFiles as StoragePublicDTO[],
      note: data.note,
      valueAmount: data.valueAmount,
      statusDetail,
      typeDetail,
    };
  }
}
