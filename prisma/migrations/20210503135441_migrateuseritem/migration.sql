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
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "orgId" TEXT,
DROP COLUMN "images",
ADD COLUMN     "images" JSONB,
DROP COLUMN "checkBeforeRentDocuments",
ADD COLUMN     "checkBeforeRentDocuments" JSONB,
DROP COLUMN "keepWhileRentingDocuments",
ADD COLUMN     "keepWhileRentingDocuments" JSONB;

-- AlterTable
ALTER TABLE "RentingItemRequestActivity" DROP COLUMN "files",
ADD COLUMN     "files" JSONB;

-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "avatarImage",
ADD COLUMN     "avatarImage" JSONB,
DROP COLUMN "coverImage",
ADD COLUMN     "coverImage" JSONB;

-- AlterTable
ALTER TABLE "UserNotification" DROP COLUMN "data",
ADD COLUMN     "data" JSONB;

-- AddForeignKey
ALTER TABLE "Item" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
