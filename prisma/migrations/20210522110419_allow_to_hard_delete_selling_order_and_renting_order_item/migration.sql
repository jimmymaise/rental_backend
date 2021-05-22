/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `RentingOrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `SellingOrder` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "selling_order_no_delete_index";

-- DropIndex
DROP INDEX "selling_order_status_no_delete_index";

-- AlterTable
ALTER TABLE "RentingOrderItem" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "SellingOrder" DROP COLUMN "isDeleted";

-- CreateIndex
CREATE INDEX "selling_order_status_index" ON "SellingOrder"("orgId", "status");
