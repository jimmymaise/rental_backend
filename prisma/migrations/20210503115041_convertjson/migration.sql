/*
  Warnings:

  - The `images` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `checkBeforeRentDocuments` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `keepWhileRentingDocuments` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "images",
ADD COLUMN     "images" JSONB,
DROP COLUMN "checkBeforeRentDocuments",
ADD COLUMN     "checkBeforeRentDocuments" JSONB,
DROP COLUMN "keepWhileRentingDocuments",
ADD COLUMN     "keepWhileRentingDocuments" JSONB;
