/*
  Warnings:

  - Changed the type of `systemStatus` on the `RentingOrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RentingOrderItem" DROP COLUMN "systemStatus",
ADD COLUMN     "systemStatus" "SellingOrderSystemStatusType" NOT NULL;

-- DropEnum
DROP TYPE "RentingOrderItemStatusType";
