/*
  Warnings:

  - You are about to drop the column `payAmount` on the `RentingOrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RentingOrder" ADD COLUMN     "payAmount" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "RentingOrderItem" DROP COLUMN "payAmount";
