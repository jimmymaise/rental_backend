-- CreateTable
CREATE TABLE "ChatConversation" (
    "id" TEXT NOT NULL,
    "memberIds" TEXT[],
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "replyToId" TEXT,
    "chatConversationId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_chat_message_index" ON "ChatMessage"("replyToId", "id");

-- CreateIndex
CREATE INDEX "owner_index" ON "ChatMessage"("fromUserId", "toUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_replyToId_unique" ON "ChatMessage"("replyToId");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD FOREIGN KEY("replyToId")REFERENCES "ChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD FOREIGN KEY("chatConversationId")REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
