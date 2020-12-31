/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[userId]` on the table `UserInfo`. If there are existing duplicate values, the migration will fail.
  - Added the required column `userId` to the `UserInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "owner_index";

-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_userId_unique" ON "UserInfo"("userId");

-- AddForeignKey
ALTER TABLE "UserInfo" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
