/*
  Warnings:

  - Added the required column `systemType` to the `RentingDepositItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RentingDepositItem" ADD COLUMN     "systemType" "RentingDepositItemSystemType" NOT NULL;
