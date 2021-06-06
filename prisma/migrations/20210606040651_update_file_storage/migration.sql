/*
  Warnings:

  - The values [UserRentingDocuments] on the enum `FileUsingLocate` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FileUsingLocate_new" AS ENUM ('ItemPreviewImage', 'UserAvatarImage', 'UserCoverImage', 'OrgAvatarImage', 'RentingOrderItemImage', 'RentingDepositItemImage', 'SellingOrderActivityImage', 'BookingActivityImage');
ALTER TABLE "FileStorage" ALTER COLUMN "usingLocate" TYPE "FileUsingLocate_new" USING ("usingLocate"::text::"FileUsingLocate_new");
ALTER TYPE "FileUsingLocate" RENAME TO "FileUsingLocate_old";
ALTER TYPE "FileUsingLocate_new" RENAME TO "FileUsingLocate";
DROP TYPE "FileUsingLocate_old";
COMMIT;

-- AlterTable
ALTER TABLE "FileStorage" ADD COLUMN     "sizes" TEXT[];
