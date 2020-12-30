-- CreateTable
CREATE TABLE "UserChatSession" (
    "id" TEXT NOT NULL,
    "memberIds" TEXT[],
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChatMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "replyToId" TEXT,
    "userChatSessionId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_chat_message_index" ON "UserChatMessage"("replyToId", "id");

-- CreateIndex
CREATE INDEX "owner_index" ON "UserChatMessage"("fromUserId", "toUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChatMessage_replyToId_unique" ON "UserChatMessage"("replyToId");

-- AddForeignKey
ALTER TABLE "UserChatMessage" ADD FOREIGN KEY("replyToId")REFERENCES "UserChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatMessage" ADD FOREIGN KEY("userChatSessionId")REFERENCES "UserChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
