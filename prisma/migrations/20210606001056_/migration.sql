/*
  Warnings:

  - The values [Approved] on the enum `RentingDepositItemSystemStatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RentingDepositItemSystemStatusType_new" AS ENUM ('New', 'PickedUp', 'Returned');
ALTER TABLE "RentingDepositItem" ALTER COLUMN "systemStatus" TYPE "RentingDepositItemSystemStatusType_new" USING ("systemStatus"::text::"RentingDepositItemSystemStatusType_new");
ALTER TYPE "RentingDepositItemSystemStatusType" RENAME TO "RentingDepositItemSystemStatusType_old";
ALTER TYPE "RentingDepositItemSystemStatusType_new" RENAME TO "RentingDepositItemSystemStatusType";
DROP TYPE "RentingDepositItemSystemStatusType_old";
COMMIT;
