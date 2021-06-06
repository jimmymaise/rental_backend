/*
  Warnings:

  - The values [InProgress,Completed,Approved] on the enum `SellingOrderSystemStatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SellingOrderSystemStatusType_new" AS ENUM ('New', 'Reserved', 'PickedUp', 'Returned', 'Cancelled');
ALTER TABLE "SellingOrder" ALTER COLUMN "systemStatus" TYPE "SellingOrderSystemStatusType_new" USING ("systemStatus"::text::"SellingOrderSystemStatusType_new");
ALTER TYPE "SellingOrderSystemStatusType" RENAME TO "SellingOrderSystemStatusType_old";
ALTER TYPE "SellingOrderSystemStatusType_new" RENAME TO "SellingOrderSystemStatusType";
DROP TYPE "SellingOrderSystemStatusType_old";
COMMIT;
