/*
  Warnings:

  - You are about to drop the column `memberIds` on the `UserChatSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserChatMessage" ADD COLUMN     "isRead" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "UserChatSession" DROP COLUMN "memberIds";

-- CreateTable
CREATE TABLE "UserChatSessionMember" (
    "userChatSessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userChatSessionId","userId")
);

-- AddForeignKey
ALTER TABLE "UserChatSessionMember" ADD FOREIGN KEY("userChatSessionId")REFERENCES "UserChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
