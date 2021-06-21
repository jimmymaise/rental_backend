/*
  Warnings:

  - You are about to drop the column `updatedDate` on the `OrgTransactionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `OrgTransactionHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrgTransactionHistory" DROP COLUMN "updatedDate",
DROP COLUMN "updatedBy";
