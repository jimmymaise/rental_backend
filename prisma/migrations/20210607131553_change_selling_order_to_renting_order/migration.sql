/*
  Warnings:

  - The values [SellingOrderStatus] on the enum `CommonAttributesType` will be removed. If these variants are still used in the database, this will fail.
  - The values [SellingOrderActivityImage] on the enum `FileUsingLocate` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `sellingOrderId` on the `RentingDepositItem` table. All the data in the column will be lost.
  - You are about to drop the column `sellingOrderId` on the `RentingOrderItem` table. All the data in the column will be lost.
  - You are about to drop the `SellingOrder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rentingOrderId` to the `RentingDepositItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentingOrderId` to the `RentingOrderItem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `systemStatus` on the `RentingOrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RentingOrderSystemStatusType" AS ENUM ('New', 'Reserved', 'PickedUp', 'Returned', 'Cancelled');

-- AlterEnum
BEGIN;
CREATE TYPE "CommonAttributesType_new" AS ENUM ('RentingOrderStatus', 'RentingOrderItemStatus', 'RentingDepositItemStatus', 'RentingDepositItemType');
ALTER TABLE "CommonAttributesConfig" ALTER COLUMN "type" TYPE "CommonAttributesType_new" USING ("type"::text::"CommonAttributesType_new");
ALTER TYPE "CommonAttributesType" RENAME TO "CommonAttributesType_old";
ALTER TYPE "CommonAttributesType_new" RENAME TO "CommonAttributesType";
DROP TYPE "CommonAttributesType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "FileUsingLocate_new" AS ENUM ('ItemPreviewImage', 'UserAvatarImage', 'UserCoverImage', 'OrgAvatarImage', 'RentingOrderItemImage', 'RentingDepositItemImage', 'RentingOrderActivityImage', 'BookingActivityImage');
ALTER TABLE "FileStorage" ALTER COLUMN "usingLocate" TYPE "FileUsingLocate_new" USING ("usingLocate"::text::"FileUsingLocate_new");
ALTER TYPE "FileUsingLocate" RENAME TO "FileUsingLocate_old";
ALTER TYPE "FileUsingLocate_new" RENAME TO "FileUsingLocate";
DROP TYPE "FileUsingLocate_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "SellingOrder" DROP CONSTRAINT "SellingOrder_customerUserId_fkey";

-- DropForeignKey
ALTER TABLE "SellingOrder" DROP CONSTRAINT "SellingOrder_orgId_fkey";

-- DropForeignKey
ALTER TABLE "RentingDepositItem" DROP CONSTRAINT "RentingDepositItem_sellingOrderId_fkey";

-- DropForeignKey
ALTER TABLE "RentingOrderItem" DROP CONSTRAINT "RentingOrderItem_sellingOrderId_fkey";

-- AlterTable
ALTER TABLE "RentingDepositItem" DROP COLUMN "sellingOrderId",
ADD COLUMN     "rentingOrderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RentingOrderItem" DROP COLUMN "sellingOrderId",
ADD COLUMN     "rentingOrderId" TEXT NOT NULL,
DROP COLUMN "systemStatus",
ADD COLUMN     "systemStatus" "RentingOrderSystemStatusType" NOT NULL;

-- DropTable
DROP TABLE "SellingOrder";

-- DropEnum
DROP TYPE "SellingOrderSystemStatusType";

-- CreateTable
CREATE TABLE "RentingOrder" (
    "id" TEXT NOT NULL,
    "orderCustomId" TEXT,
    "orgId" TEXT NOT NULL,
    "totalAmount" INTEGER DEFAULT 0,
    "note" TEXT,
    "customerUserId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "systemStatus" "RentingOrderSystemStatusType" NOT NULL,
    "status" TEXT NOT NULL,
    "attachedFiles" JSONB,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "selling_order_status_index" ON "RentingOrder"("orgId", "status");

-- AddForeignKey
ALTER TABLE "RentingOrder" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrder" ADD FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingDepositItem" ADD FOREIGN KEY ("rentingOrderId") REFERENCES "RentingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderItem" ADD FOREIGN KEY ("rentingOrderId") REFERENCES "RentingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
