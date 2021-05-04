/*
  Warnings:

  - The `images` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `checkBeforeRentDocuments` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `keepWhileRentingDocuments` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `files` column on the `RentingItemRequestActivity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `avatarImage` column on the `UserInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `coverImage` column on the `UserInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `data` column on the `UserNotification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- Add backupImages
ALTER TABLE "Item" ADD COLUMN "imagesBackup" TEXT;
-- Backup Data
UPDATE "Item" set "imagesBackup" = "images";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "orgId" TEXT,
DROP COLUMN "images",
ADD COLUMN     "images" JSONB,
DROP COLUMN "checkBeforeRentDocuments",
ADD COLUMN     "checkBeforeRentDocuments" JSONB,
DROP COLUMN "keepWhileRentingDocuments",
ADD COLUMN     "keepWhileRentingDocuments" JSONB;

-- Restore Data
UPDATE "Item" set "images" = "imagesBackup"::json;
ALTER TABLE "Item" DROP COLUMN "imagesBackup";

-- AlterTable
ALTER TABLE "RentingItemRequestActivity" DROP COLUMN "files",
ADD COLUMN     "files" JSONB;

-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN "avatarImageBackup" TEXT;
-- Backup Data
UPDATE "UserInfo" set "avatarImageBackup" = "avatarImage";

ALTER TABLE "UserInfo" ADD COLUMN "coverImageBackup" TEXT;
-- Backup Data
UPDATE "UserInfo" set "coverImageBackup" = "coverImage";

ALTER TABLE "UserInfo" DROP COLUMN "avatarImage",
ADD COLUMN     "avatarImage" JSONB,
DROP COLUMN "coverImage",
ADD COLUMN     "coverImage" JSONB;

-- Restore Data
UPDATE "UserInfo" set "avatarImage" = "avatarImageBackup"::json;
ALTER TABLE "UserInfo" DROP COLUMN "avatarImageBackup";

UPDATE "UserInfo" set "coverImage" = "coverImageBackup"::json;
ALTER TABLE "UserInfo" DROP COLUMN "coverImageBackup";


-- AlterTable
ALTER TABLE "UserNotification" ADD COLUMN "dataBackup" TEXT;
-- Backup Data
UPDATE "UserNotification" set "dataBackup" = "data";

ALTER TABLE "UserNotification" DROP COLUMN "data",
ADD COLUMN     "data" JSONB;

UPDATE "UserNotification" set "data" = "dataBackup"::json;
ALTER TABLE "UserNotification" DROP COLUMN "dataBackup";

-- AddForeignKey
ALTER TABLE "Item" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
