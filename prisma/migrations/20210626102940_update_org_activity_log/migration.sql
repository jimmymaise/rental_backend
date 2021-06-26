/*
  Warnings:

  - You are about to drop the column `rentingOrderId` on the `OrgTransactionHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrgTransactionHistory" DROP CONSTRAINT "OrgTransactionHistory_rentingOrderId_fkey";

-- AlterTable
ALTER TABLE "OrgTransactionHistory" DROP COLUMN "rentingOrderId";

-- CreateTable
CREATE TABLE "RentingOrderOrgActivityLog" (
    "orgActivityLogId" TEXT NOT NULL,
    "rentingOrderId" TEXT NOT NULL,

    PRIMARY KEY ("orgActivityLogId")
);

-- CreateTable
CREATE TABLE "ItemOrgActivityLog" (
    "orgActivityLogId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    PRIMARY KEY ("orgActivityLogId")
);

-- CreateTable
CREATE TABLE "CustomerOrgActivityLog" (
    "orgActivityLogId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    PRIMARY KEY ("orgActivityLogId")
);

-- AddForeignKey
ALTER TABLE "RentingOrderOrgActivityLog" ADD FOREIGN KEY ("orgActivityLogId") REFERENCES "OrgActivityLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderOrgActivityLog" ADD FOREIGN KEY ("rentingOrderId") REFERENCES "RentingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrgActivityLog" ADD FOREIGN KEY ("orgActivityLogId") REFERENCES "OrgActivityLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrgActivityLog" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrgActivityLog" ADD FOREIGN KEY ("orgActivityLogId") REFERENCES "OrgActivityLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrgActivityLog" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
