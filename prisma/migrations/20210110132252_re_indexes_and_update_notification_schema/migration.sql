/*
  Warnings:

  - The migration will remove the values [NewRequestRenting,RequestRentingIsApproved,NewCommentInRequestRenting] on the enum `UserNotificationType`. If these variants are still used in the database, the migration will fail.
  - You are about to drop the column `title` on the `UserNotification` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `UserNotification` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserNotificationType_new" AS ENUM ('RentingRequestIsCreated', 'RentingRequestIsDeclined', 'RentingRequestIsApproved', 'RentingRequestIsInProgress', 'RentingRequestIsCompleted', 'RentingRequestIsCancelled');
ALTER TABLE "public"."UserNotification" ALTER COLUMN "type" TYPE "UserNotificationType_new" USING ("type"::text::"UserNotificationType_new");
ALTER TYPE "UserNotificationType" RENAME TO "UserNotificationType_old";
ALTER TYPE "UserNotificationType_new" RENAME TO "UserNotificationType";
DROP TYPE "UserNotificationType_old";
COMMIT;

-- DropIndex
DROP INDEX "file_storage_main_index";

-- DropIndex
DROP INDEX "item_main_index";

-- DropIndex
DROP INDEX "renting_item_request_main_index";

-- AlterTable
ALTER TABLE "UserNotification" DROP COLUMN "title",
DROP COLUMN "content",
ADD COLUMN     "data" TEXT,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "file_storage_main_index" ON "FileStorage"("folderName", "createdBy");

-- CreateIndex
CREATE INDEX "item_main_index" ON "Item"("keyword");

-- CreateIndex
CREATE INDEX "user_notification_index" ON "UserNotification"("forUserId");

-- AddForeignKey
ALTER TABLE "ItemReview" ADD FOREIGN KEY("ownerUserId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingItemRequest" ADD FOREIGN KEY("ownerUserId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingItemRequest" ADD FOREIGN KEY("lenderUserId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD FOREIGN KEY("toUserId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD FOREIGN KEY("ownerUserId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
