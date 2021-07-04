/*
  Warnings:

  - You are about to drop the column `payAmount` on the `OrgDailyItemStatistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrgDailyItemStatistics" DROP COLUMN "payAmount",
ADD COLUMN     "refundDamagesAmount" INTEGER DEFAULT 0;
