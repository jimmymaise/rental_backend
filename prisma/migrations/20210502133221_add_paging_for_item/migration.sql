/*
  Warnings:

  - Added the required column `orgId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
