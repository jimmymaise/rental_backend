/*
  Warnings:

  - The `files` column on the `RentingItemRequestActivity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `avatarImage` column on the `UserInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `coverImage` column on the `UserInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `data` column on the `UserNotification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
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
