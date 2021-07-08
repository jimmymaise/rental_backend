-- AlterTable
ALTER TABLE "RentingDepositItem" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "RentingOrderItem" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;
