/*
  Warnings:

  - You are about to drop the `CommonValuesConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CommonAttributesType" AS ENUM ('SellingOrderStatus', 'SellingOrderItemStatus', 'RentingDepositItemStatus', 'RentingDepositItemType');

-- DropTable
DROP TABLE "CommonValuesConfig";

-- DropEnum
DROP TYPE "CommonValuesType";

-- CreateTable
CREATE TABLE "CommonAttributesConfig" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "CommonAttributesType" NOT NULL,
    "customConfigs" JSONB,
    "mapWithSystemValue" TEXT,
    "isDisabled" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN,
    "isDefault" BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,

    PRIMARY KEY ("id")
);
