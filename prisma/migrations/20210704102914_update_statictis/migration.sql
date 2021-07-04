/*
  Warnings:

  - You are about to drop the column `debtAmount` on the `OrgDailyItemStatistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrgDailyItemStatistics" DROP COLUMN "debtAmount",
ADD COLUMN     "payDamagesAmount" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "OrgDailyOrderStatistics" ADD COLUMN     "rentingOrderPayAmount" INTEGER DEFAULT 0,
ADD COLUMN     "rentingOrderRefundAmount" INTEGER DEFAULT 0;
