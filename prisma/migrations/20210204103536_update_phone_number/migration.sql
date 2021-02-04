/*
  Warnings:

  - You are about to drop the column `PhoneNumber` on the `User` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[phoneNumber]` on the table `User`. If there are existing duplicate values, the migration will fail.

*/
-- DropIndex
DROP INDEX "User.PhoneNumber_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "PhoneNumber",
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN     "phoneNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User.phoneNumber_unique" ON "User"("phoneNumber");
