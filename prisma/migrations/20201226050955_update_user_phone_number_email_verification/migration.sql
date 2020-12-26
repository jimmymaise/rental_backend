/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[PhoneNumber]` on the table `User`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "PhoneNumber" TEXT,
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "verifyEmailToken" TEXT,
ADD COLUMN     "verifyPhoneToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User.PhoneNumber_unique" ON "User"("PhoneNumber");
