/*
  Warnings:

  - You are about to drop the column `rentingOrderItemId` on the `RentingDepositItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RentingDepositItem" DROP CONSTRAINT "RentingDepositItem_rentingOrderItemId_fkey";

-- DropIndex
DROP INDEX "SellingOrder.orderCustomId_unique";

-- AlterTable
ALTER TABLE "RentingDepositItem" DROP COLUMN "rentingOrderItemId";
