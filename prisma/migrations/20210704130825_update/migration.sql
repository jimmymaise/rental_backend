/*
  Warnings:

  - The primary key for the `OrgDailyCategoryStatistics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrgDailyCustomerTradeCountStatistics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrgDailyCustomerTradeCountStatistics` table. All the data in the column will be lost.
  - The primary key for the `OrgDailyItemStatistics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrgDailyOrderStatistics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `orgCategoryId` on table `OrgDailyCategoryStatistics` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "org_daily_customer_trade_count_statistics_entry_date_time_index";

-- AlterTable
ALTER TABLE "OrgDailyCategoryStatistics" DROP CONSTRAINT "OrgDailyCategoryStatistics_pkey",
ALTER COLUMN "orgCategoryId" SET NOT NULL,
ADD PRIMARY KEY ("orgId", "entryDateTime", "orgCategoryId");

-- AlterTable
ALTER TABLE "OrgDailyCustomerTradeCountStatistics" DROP CONSTRAINT "OrgDailyCustomerTradeCountStatistics_pkey",
DROP COLUMN "id",
ADD PRIMARY KEY ("orgId", "entryDateTime", "startTime", "endTime");

-- AlterTable
ALTER TABLE "OrgDailyItemStatistics" DROP CONSTRAINT "OrgDailyItemStatistics_pkey",
ADD PRIMARY KEY ("orgId", "entryDateTime", "itemId");

-- AlterTable
ALTER TABLE "OrgDailyOrderStatistics" DROP CONSTRAINT "OrgDailyOrderStatistics_pkey",
ADD PRIMARY KEY ("orgId", "entryDateTime");
