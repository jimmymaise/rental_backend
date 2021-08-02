import moment from 'moment';

const WEEK_DAY = 7;
const MONTH_DAY = 30;

export interface CalcOrderRentingItemAmountParam {
  fromDate?: number;
  toDate?: number;
  fixedPrice?: number;
  rentPricePerDay: number;
  rentPricePerWeek: number;
  rentPricePerMonth: number;
  quantity: number;
}

export interface CalcOrderRentingItemAmountResult {
  fromDate?: number;
  toDate?: number;
  fixedPrice: number;
  rentPricePerDay: number;
  rentPricePerWeek: number;
  rentPricePerMonth: number;
  quantity: number;
  countOfDay: number;
  countOfWeek: number;
  countOfMonth: number;
  unitDayAmount: number;
  unitWeekAmount: number;
  unitMonthAmount: number;
  unitTotalAmount: number;
  dayAmount: number;
  weekAmount: number;
  monthAmount: number;
  totalAmount: number;
  isCalcByFixedPrice?: boolean;
  isCalculated?: boolean;
}

export function calcAmount({
  fixedPrice,
  rentPricePerDay,
  rentPricePerWeek,
  rentPricePerMonth,
  fromDate,
  toDate,
  quantity,
}: CalcOrderRentingItemAmountParam): CalcOrderRentingItemAmountResult {
  const result: CalcOrderRentingItemAmountResult = {
    fromDate,
    toDate,
    fixedPrice,
    rentPricePerDay,
    rentPricePerWeek,
    rentPricePerMonth,
    quantity,
    countOfDay: 0,
    countOfWeek: 0,
    countOfMonth: 0,
    totalAmount: 0,
    dayAmount: 0,
    weekAmount: 0,
    monthAmount: 0,
    unitDayAmount: 0,
    unitWeekAmount: 0,
    unitMonthAmount: 0,
    unitTotalAmount: 0,
  };

  if (!fromDate || !toDate) {
    return result;
  }

  result.isCalculated = true;
  let remainingDays =
    Math.abs(moment(fromDate).diff(moment(toDate), 'day')) || 1;

  if (fixedPrice && fixedPrice > 0) {
    result.isCalcByFixedPrice = true;
    result.unitTotalAmount = fixedPrice * remainingDays;
    result.totalAmount = result.unitTotalAmount * quantity;
    result.countOfDay = remainingDays;
  } else {
    if (rentPricePerMonth > 0) {
      const numberOfMonth = parseInt((remainingDays / MONTH_DAY).toString());
      if (numberOfMonth >= 1) {
        remainingDays = remainingDays % MONTH_DAY;

        result.countOfMonth = numberOfMonth;
        result.unitMonthAmount = result.countOfMonth * result.rentPricePerMonth;
        result.monthAmount = result.unitMonthAmount * quantity;
      }
    }

    if (rentPricePerWeek > 0) {
      const numberOfWeek = parseInt((remainingDays / WEEK_DAY).toString());

      if (numberOfWeek >= 1) {
        remainingDays = remainingDays % WEEK_DAY;

        result.countOfWeek = numberOfWeek;

        result.unitWeekAmount = result.countOfWeek * result.rentPricePerWeek;
        result.weekAmount = result.unitWeekAmount * quantity;
      }
    }

    if (rentPricePerDay > 0 && remainingDays > 0) {
      result.countOfDay = remainingDays;

      result.unitDayAmount = result.countOfDay * result.rentPricePerDay;
      result.dayAmount = result.unitDayAmount * quantity;
    }

    result.unitTotalAmount =
      result.unitDayAmount + result.unitWeekAmount + result.unitMonthAmount;
    result.totalAmount =
      result.dayAmount + result.weekAmount + result.monthAmount;
  }

  return result;
}
