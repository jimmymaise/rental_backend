/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `CommonAttributesConfig` table. All the data in the column will be lost.
  - Added the required column `updatedDate` to the `CommonAttributesConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `CommonAttributesConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommonAttributesConfig" DROP COLUMN "isDeleted",
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;
