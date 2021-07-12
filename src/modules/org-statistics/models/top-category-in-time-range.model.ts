export interface TopCategoryInTimeRangeModel {
  id: string;
  name: string;
  slug: string;
  newRentingOrderCount: number;
  cancelledRentingOrderCount: number;
  viewCount: number;
  amount: number;
  returnedRentingOrderCount: number;
}

export default TopCategoryInTimeRangeModel;
