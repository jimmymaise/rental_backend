-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'User');

-- CreateEnum
CREATE TYPE "UserVerifyDocumentType" AS ENUM ('Facebook', 'Email', 'PhoneNumber');

-- CreateEnum
CREATE TYPE "FileUsingLocate" AS ENUM ('ItemPreviewImage', 'UserAvatarImage', 'UserCoverImage');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('Draft', 'Blocked', 'Published');

-- CreateEnum
CREATE TYPE "RentingMandatoryVerifyDocumentDataType" AS ENUM ('Label', 'Currency');

-- CreateEnum
CREATE TYPE "RentingItemRequestStatus" AS ENUM ('New', 'Declined', 'Approved', 'InProgress', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "RentingItemRequestActivityType" AS ENUM ('Comment', 'Declined', 'Approved', 'InProgress', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "UserNotificationType" AS ENUM ('NewRequestRenting', 'RequestRentingIsApproved', 'NewCommentInRequestRenting');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "currentHashedRefreshToken" TEXT,
    "role" "UserRole"[],
    "facebookId" TEXT,
    "facebookAccessToken" TEXT,
    "googleId" TEXT,
    "googleAccessToken" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInfo" (
    "id" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "avatarImage" TEXT,
    "coverImage" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserIdentifyDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "UserVerifyDocumentType" NOT NULL,
    "value" TEXT NOT NULL,
    "isVerfied" BOOLEAN,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentAreaId" TEXT,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "order" INTEGER DEFAULT 0,
    "isDefault" BOOLEAN DEFAULT false,
    "isDisabled" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "coverImageUrl" TEXT,
    "parentCategoryId" TEXT,
    "order" INTEGER DEFAULT 0,
    "isDefault" BOOLEAN DEFAULT false,
    "isDisabled" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,
    "isFeatured" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileStorage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bucketName" TEXT NOT NULL,
    "folderName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "usingLocate" "FileUsingLocate",
    "isUploadSuccess" BOOLEAN DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT,
    "checkBeforeRentDocuments" TEXT,
    "keepWhileRentingDocuments" TEXT,
    "unavailableForRentDays" TIMESTAMP(3)[],
    "currentOriginalPrice" DECIMAL(65,30),
    "sellPrice" DECIMAL(65,30),
    "rentPricePerDay" DECIMAL(65,30),
    "rentPricePerWeek" DECIMAL(65,30),
    "rentPricePerMonth" DECIMAL(65,30),
    "currencyCode" TEXT,
    "summaryReviewCore" DECIMAL(65,30),
    "summaryReviewCount" DECIMAL(65,30),
    "totalQuantity" INTEGER NOT NULL DEFAULT 1,
    "isVerified" BOOLEAN DEFAULT false,
    "status" "ItemStatus" NOT NULL,
    "note" TEXT,
    "ownerUserId" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "keyword" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingMandatoryVerifyDocument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataType" "RentingMandatoryVerifyDocumentDataType" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingItemRequest" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "totalAmount" DECIMAL(65,30) DEFAULT 0,
    "actualTotalAmount" DECIMAL(65,30) DEFAULT 0,
    "rentTotalQuantity" INTEGER DEFAULT 1,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "status" "RentingItemRequestStatus",
    "ownerUserId" TEXT NOT NULL,
    "lenderUserId" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemReview" (
    "id" TEXT NOT NULL,
    "rentingRequestId" TEXT,
    "itemId" TEXT NOT NULL,
    "reviewScore" INTEGER NOT NULL,
    "reviewComment" TEXT,
    "images" TEXT,
    "ownerUserId" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReview" (
    "id" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "rentingRequestId" TEXT,
    "reviewScore" INTEGER NOT NULL,
    "reviewComment" TEXT,
    "ownerUserId" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingItemRequestActivity" (
    "id" TEXT NOT NULL,
    "rentingItemRequestId" TEXT NOT NULL,
    "comment" TEXT,
    "type" "RentingItemRequestActivityType" NOT NULL,
    "files" TEXT,
    "isDisabled" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchKeyword" (
    "keyword" TEXT NOT NULL,
    "count" INTEGER DEFAULT 0,

    PRIMARY KEY ("keyword")
);

-- CreateTable
CREATE TABLE "UserLoginLog" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "signedInDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" TEXT NOT NULL,
    "forUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT,
    "type" "UserNotificationType" NOT NULL,
    "isRead" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishingItem" (
    "ownerUserId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("ownerUserId","itemId")
);

-- CreateTable
CREATE TABLE "MyUserContact" (
    "ownerUserId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("ownerUserId","userId")
);

-- CreateTable
CREATE TABLE "_AreaToItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.currentHashedRefreshToken_unique" ON "User"("currentHashedRefreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "User.facebookId_unique" ON "User"("facebookId");

-- CreateIndex
CREATE UNIQUE INDEX "User.googleId_unique" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Area.slug_unique" ON "Area"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category.slug_unique" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "file_storage_main_index" ON "FileStorage"("bucketName", "folderName");

-- CreateIndex
CREATE UNIQUE INDEX "Item.slug_unique" ON "Item"("slug");

-- CreateIndex
CREATE INDEX "item_main_index" ON "Item"("slug", "keyword", "status", "ownerUserId", "isDeleted");

-- CreateIndex
CREATE INDEX "renting_item_request_main_index" ON "RentingItemRequest"("itemId", "ownerUserId", "lenderUserId", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "_AreaToItem_AB_unique" ON "_AreaToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaToItem_B_index" ON "_AreaToItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToItem_AB_unique" ON "_CategoryToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToItem_B_index" ON "_CategoryToItem"("B");

-- AddForeignKey
ALTER TABLE "RentingItemRequest" ADD FOREIGN KEY("itemId")REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemReview" ADD FOREIGN KEY("itemId")REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingItemRequestActivity" ADD FOREIGN KEY("rentingItemRequestId")REFERENCES "RentingItemRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishingItem" ADD FOREIGN KEY("itemId")REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MyUserContact" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToItem" ADD FOREIGN KEY("A")REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToItem" ADD FOREIGN KEY("B")REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD FOREIGN KEY("A")REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD FOREIGN KEY("B")REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
