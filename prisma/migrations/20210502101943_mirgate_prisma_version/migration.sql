/*
  Warnings:

  - You are about to alter the column `latitude` on the `Area` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `longitude` on the `Area` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `currentOriginalPrice` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `sellPrice` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `rentPricePerDay` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `rentPricePerWeek` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `rentPricePerMonth` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `summaryReviewCore` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `summaryReviewCount` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `totalAmount` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `actualTotalAmount` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `rentPricePerDay` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `rentPricePerWeek` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `rentPricePerMonth` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `organizationId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `SearchKeyword` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_organizationId_fkey";

-- DropIndex
DROP INDEX "UserInfo_userId_unique";

-- AlterTable
ALTER TABLE "Area" ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "currentOriginalPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "sellPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rentPricePerDay" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rentPricePerWeek" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rentPricePerMonth" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "summaryReviewCore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "summaryReviewCount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "RentingItemRequest" ALTER COLUMN "totalAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "actualTotalAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rentPricePerDay" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rentPricePerWeek" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rentPricePerMonth" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "SearchKeyword" DROP COLUMN "count",
ADD COLUMN     "searchCount" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "_OrganizationToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToRole_AB_unique" ON "_OrganizationToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToRole_B_index" ON "_OrganizationToRole"("B");

-- AddForeignKey
ALTER TABLE "_OrganizationToRole" ADD FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToRole" ADD FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
