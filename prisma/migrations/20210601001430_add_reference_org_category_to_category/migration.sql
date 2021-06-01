/*
  Warnings:

  - Added the required column `categoryId` to the `OrgCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrgCategory" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrgCategory" ADD FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
