-- DropIndex
DROP INDEX "item_main_index";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "updatedDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ItemReview" ALTER COLUMN "updatedDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RentingItemRequest" ALTER COLUMN "updatedDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RentingItemRequestActivity" ALTER COLUMN "updatedDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserReview" ALTER COLUMN "updatedDate" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "item_main_index" ON "Item"("status", "isDeleted", "isVerified");

-- CreateIndex
CREATE INDEX "item_created_date_index" ON "Item"("createdDate");
