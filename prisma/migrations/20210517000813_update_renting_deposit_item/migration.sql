/*
  Warnings:

  - The values [InProgress] on the enum `RentingDepositItemSystemStatusType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isMoney` on the `RentingDepositItem` table. All the data in the column will be lost.
  - You are about to drop the column `isReturned` on the `RentingDepositItem` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RentingDepositItemSystemStatusType_new" AS ENUM ('New', 'Approved', 'Returned');
ALTER TABLE "RentingDepositItem" ALTER COLUMN "systemStatus" TYPE "RentingDepositItemSystemStatusType_new" USING ("systemStatus"::text::"RentingDepositItemSystemStatusType_new");
ALTER TYPE "RentingDepositItemSystemStatusType" RENAME TO "RentingDepositItemSystemStatusType_old";
ALTER TYPE "RentingDepositItemSystemStatusType_new" RENAME TO "RentingDepositItemSystemStatusType";
DROP TYPE "RentingDepositItemSystemStatusType_old";
COMMIT;

-- AlterTable
ALTER TABLE "RentingDepositItem" DROP COLUMN "isMoney",
DROP COLUMN "isReturned";
