/*
  Warnings:

  - The values [InProgress,Completed,Approved] on the enum `RentingOrderItemStatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RentingOrderItemStatusType_new" AS ENUM ('New', 'Reserved', 'PickedUp', 'Returned', 'Cancelled');
ALTER TABLE "RentingOrderItem" ALTER COLUMN "systemStatus" TYPE "RentingOrderItemStatusType_new" USING ("systemStatus"::text::"RentingOrderItemStatusType_new");
ALTER TYPE "RentingOrderItemStatusType" RENAME TO "RentingOrderItemStatusType_old";
ALTER TYPE "RentingOrderItemStatusType_new" RENAME TO "RentingOrderItemStatusType";
DROP TYPE "RentingOrderItemStatusType_old";
COMMIT;
