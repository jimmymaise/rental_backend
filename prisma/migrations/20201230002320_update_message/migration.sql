/*
  Warnings:

  - You are about to drop the column `toUserId` on the `ChatMessage` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "owner_index";

-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "toUserId";

-- CreateIndex
CREATE INDEX "owner_index" ON "ChatMessage"("fromUserId");
