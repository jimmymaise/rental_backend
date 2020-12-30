/*
  Warnings:

  - You are about to drop the column `memberIds` on the `ChatConversation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "isRead" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "ChatConversation" DROP COLUMN "memberIds";

-- CreateTable
CREATE TABLE "ChatConversationMember" (
    "chatConversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("chatConversationId","userId")
);

-- AddForeignKey
ALTER TABLE "ChatConversationMember" ADD FOREIGN KEY("chatConversationId")REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
