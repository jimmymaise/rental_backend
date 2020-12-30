/*
  Warnings:

  - You are about to drop the column `toUserId` on the `UserChatMessage` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "owner_index";

-- AlterTable
ALTER TABLE "UserChatMessage" DROP COLUMN "toUserId";

-- CreateIndex
CREATE INDEX "owner_index" ON "UserChatMessage"("fromUserId");
