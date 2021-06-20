/*
  Warnings:

  - You are about to drop the column `count` on the `OrgDailyCustomerTradeCountStatistics` table. All the data in the column will be lost.
  - Added the required column `customerCount` to the `OrgDailyCustomerTradeCountStatistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrgDailyCustomerTradeCountStatistics" DROP COLUMN "count",
ADD COLUMN     "customerCount" INTEGER NOT NULL;
