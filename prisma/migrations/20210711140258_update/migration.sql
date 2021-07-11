-- AlterTable
ALTER TABLE "OrgCategoryStatistics" ADD COLUMN     "returnedRentingOrderCount" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "OrgItemStatistics" ADD COLUMN     "returnedRentingOrderCount" INTEGER DEFAULT 0;
