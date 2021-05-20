import { RentingDepositItem } from '@prisma/client';
import { StoragePublicDTO } from '../../storages/storage-public.dto';

export class RentingDepositItemModel {
  public id: string;
  public type: string;
  public note?: string;
  public valueAmount?: number;
  public attachedFiles?: StoragePublicDTO[];

  public static fromDatabase(
    data: RentingDepositItem,
  ): RentingDepositItemModel {
    return {
      id: data.id,
      type: data.type,
      attachedFiles: data.attachedFiles as StoragePublicDTO[],
      note: data.note,
      valueAmount: data.valueAmount,
    };
  }
}
