/*
  Warnings:

  - You are about to drop the column `time_1_900` on the `OrgDailyCustomerTradeTrackingCountStatistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrgDailyCustomerTradeTrackingCountStatistics" DROP COLUMN "time_1_900",
ADD COLUMN     "time_0_900" INTEGER;
