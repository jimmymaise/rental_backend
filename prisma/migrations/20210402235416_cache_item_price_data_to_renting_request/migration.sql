-- AlterTable
ALTER TABLE "RentingItemRequest" ADD COLUMN     "hidePrice" BOOLEAN DEFAULT false,
ADD COLUMN     "rentPricePerDay" DECIMAL(65,30),
ADD COLUMN     "rentPricePerWeek" DECIMAL(65,30),
ADD COLUMN     "rentPricePerMonth" DECIMAL(65,30);
