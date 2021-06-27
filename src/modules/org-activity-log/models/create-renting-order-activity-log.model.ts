import { RentingOrderActivityLogModel } from './renting-order-activity-log.model';

export class CreateRentingOrderActivityLogModel extends RentingOrderActivityLogModel {
  public data: {
    rentingOrderId: string;
    orderCustomId: string;
  };
}
