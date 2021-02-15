-- DropIndex
DROP INDEX "item_main_index";

-- AlterTable
ALTER TABLE "SearchKeyword" ADD COLUMN     "isVerified" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE INDEX "item_main_index" ON "Item"("status", "isDeleted", "isVerified", "keyword");
