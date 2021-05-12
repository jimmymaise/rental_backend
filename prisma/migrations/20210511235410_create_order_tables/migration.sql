-- CreateEnum
CREATE TYPE "SellingOrderSystemStatusType" AS ENUM ('New', 'InProgress', 'Completed');

-- CreateEnum
CREATE TYPE "RentingOrderItemStatusType" AS ENUM ('New', 'InProgress', 'Completed');

-- CreateEnum
CREATE TYPE "RentingDepositItemSystemStatusType" AS ENUM ('New', 'InProgress', 'Returned');

-- CreateEnum
CREATE TYPE "CommonValuesType" AS ENUM ('SellingOrderStatus', 'SellingOrderItemStatus', 'RentingDepositItemStatus', 'RentingDepositItemType');

-- AlterTable
ALTER TABLE "FileStorage" ADD COLUMN     "orgId" TEXT;

-- CreateTable
CREATE TABLE "SellingOrder" (
    "id" TEXT NOT NULL,
    "orderCustomId" TEXT,
    "orgId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION DEFAULT 0,
    "note" TEXT,
    "customerUserId" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "systemStatus" "SellingOrderSystemStatusType" NOT NULL,
    "status" TEXT NOT NULL,
    "attachedFiles" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingOrderItem" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "amount" DOUBLE PRECISION DEFAULT 0,
    "quantity" INTEGER DEFAULT 0,
    "pickupDateTime" TIMESTAMP(3),
    "returningDateTime" TIMESTAMP(3),
    "systemStatus" "RentingOrderItemStatusType" NOT NULL,
    "status" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION DEFAULT 0,
    "unitPricePerDay" DOUBLE PRECISION DEFAULT 0,
    "unitPricePerWeek" DOUBLE PRECISION DEFAULT 0,
    "unitPricePerMonth" DOUBLE PRECISION DEFAULT 0,
    "attachedFiles" JSONB,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "itemId" TEXT,
    "orgId" TEXT NOT NULL,
    "sellingOrderId" TEXT NOT NULL,
    "customerUserId" TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingDepositItem" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "note" TEXT,
    "valueAmount" DOUBLE PRECISION DEFAULT 0,
    "isMoney" BOOLEAN DEFAULT false,
    "attachedFiles" JSONB,
    "systemStatus" "RentingDepositItemSystemStatusType" NOT NULL,
    "status" TEXT NOT NULL,
    "isReturned" BOOLEAN DEFAULT false,
    "sellingOrderId" TEXT,
    "rentingOrderItemId" TEXT,
    "orgId" TEXT NOT NULL,
    "customerUserId" TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommonValuesConfig" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "CommonValuesType" NOT NULL,
    "customConfigs" JSONB,
    "mapWithSystemValue" TEXT,
    "isDisabled" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN,
    "isDefault" BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellingOrder.orderCustomId_unique" ON "SellingOrder"("orderCustomId");

-- CreateIndex
CREATE INDEX "selling_order_no_delete_index" ON "SellingOrder"("orgId", "isDeleted");

-- CreateIndex
CREATE INDEX "selling_order_status_no_delete_index" ON "SellingOrder"("orgId", "status", "isDeleted");

-- AddForeignKey
ALTER TABLE "SellingOrder" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellingOrder" ADD FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderItem" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderItem" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderItem" ADD FOREIGN KEY ("sellingOrderId") REFERENCES "SellingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderItem" ADD FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingDepositItem" ADD FOREIGN KEY ("sellingOrderId") REFERENCES "SellingOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingDepositItem" ADD FOREIGN KEY ("rentingOrderItemId") REFERENCES "RentingOrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingDepositItem" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingDepositItem" ADD FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
