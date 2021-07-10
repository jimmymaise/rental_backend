/*
  Warnings:

  - You are about to drop the column `count` on the `OrgDailyCustomerTradeTrackingCountStatistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrgDailyCustomerTradeTrackingCountStatistics" DROP COLUMN "count",
ADD COLUMN     "customerCount" INTEGER DEFAULT 0;
