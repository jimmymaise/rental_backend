-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "isDisabled" BOOLEAN DEFAULT false,
ADD COLUMN     "isPublishToMarketplace" BOOLEAN DEFAULT false;
