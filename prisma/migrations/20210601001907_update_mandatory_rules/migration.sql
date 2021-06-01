/*
  Warnings:

  - Made the column `sellingOrderId` on table `RentingDepositItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrgCategory" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RentingDepositItem" ALTER COLUMN "sellingOrderId" SET NOT NULL;
