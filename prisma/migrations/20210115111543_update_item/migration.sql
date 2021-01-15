/*
  Warnings:

  - You are about to drop the column `images` on the `UserNotification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "termAndCondition" TEXT;

-- AlterTable
ALTER TABLE "UserNotification" DROP COLUMN "images";
