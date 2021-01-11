-- DropIndex
DROP INDEX "user_notification_index";

-- CreateIndex
CREATE INDEX "user_notification_index" ON "UserNotification"("createdDate");

-- AddForeignKey
ALTER TABLE "UserNotification" ADD FOREIGN KEY("forUserId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
