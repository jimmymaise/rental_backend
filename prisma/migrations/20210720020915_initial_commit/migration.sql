-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "avatarImage" JSONB,
    "slug" TEXT,
    "domain" TEXT,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3),
    "createdBy" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSlugBooking" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isDisabled" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "displayName" TEXT,
    "gender" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "birthday" TIMESTAMP(3),
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isDisabled" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "currentOrgId" TEXT,
    "phoneNumber" TEXT,
    "passwordHash" TEXT,
    "currentHashedRefreshToken" TEXT,
    "facebookId" TEXT,
    "facebookAccessToken" TEXT,
    "googleId" TEXT,
    "googleAccessToken" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "verifyEmailToken" TEXT,
    "verifyPhoneToken" TEXT,
    "lastSignedIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isBlocked" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,
    "systemNote" TEXT,
    "isRoot" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "orgId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER DEFAULT 0,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER DEFAULT 0,
    "updatedDate" TIMESTAMP(3),

    PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "UserInfo" (
    "displayName" TEXT,
    "bio" TEXT,
    "avatarImage" JSONB,
    "coverImage" JSONB,
    "phoneNumber" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentAreaId" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
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
    "seoTitle" TEXT,
    "seoDescription" TEXT,
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
    "sizes" TEXT[],
    "usingLocate" TEXT,
    "isUploadSuccess" BOOLEAN DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN DEFAULT false,
    "orgId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "pid" SERIAL NOT NULL,
    "sku" TEXT,
    "orgId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" JSONB,
    "termAndCondition" JSONB,
    "images" JSONB,
    "checkBeforeRentDocuments" JSONB,
    "keepWhileRentingDocuments" JSONB,
    "unavailableForRentDays" TIMESTAMP(3)[],
    "currentOriginalPrice" INTEGER,
    "sellPrice" INTEGER,
    "hidePrice" BOOLEAN DEFAULT false,
    "rentPricePerDay" INTEGER,
    "rentPricePerWeek" INTEGER,
    "rentPricePerMonth" INTEGER,
    "currencyCode" TEXT,
    "summaryReviewCore" DOUBLE PRECISION,
    "summaryReviewCount" DOUBLE PRECISION,
    "totalQuantity" INTEGER NOT NULL DEFAULT 1,
    "isVerified" BOOLEAN DEFAULT false,
    "status" TEXT NOT NULL,
    "rentingStatus" TEXT,
    "note" TEXT,
    "ownerUserId" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "isDisabled" BOOLEAN DEFAULT false,
    "isPublishToMarketplace" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "keyword" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingItemRequest" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "totalAmount" INTEGER DEFAULT 0,
    "actualTotalAmount" INTEGER DEFAULT 0,
    "rentTotalQuantity" INTEGER DEFAULT 1,
    "hidePrice" BOOLEAN DEFAULT false,
    "rentPricePerDay" INTEGER,
    "rentPricePerWeek" INTEGER,
    "rentPricePerMonth" INTEGER,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT,
    "ownerUserId" TEXT NOT NULL,
    "lenderUserId" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemReview" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "refId" TEXT,
    "reviewScore" INTEGER NOT NULL,
    "reviewComment" TEXT,
    "attachedFiles" JSONB,
    "createdBy" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReview" (
    "id" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "refId" TEXT,
    "reviewScore" INTEGER NOT NULL,
    "reviewComment" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdByOrgId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "userId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingItemRequestActivity" (
    "id" TEXT NOT NULL,
    "rentingItemRequestId" TEXT NOT NULL,
    "comment" TEXT,
    "type" TEXT NOT NULL,
    "files" JSONB,
    "isDisabled" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchKeyword" (
    "keyword" TEXT NOT NULL,
    "searchCount" INTEGER DEFAULT 0,
    "isVerified" BOOLEAN DEFAULT false,

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
    "data" JSONB,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "orgId" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("ownerUserId","userId")
);

-- CreateTable
CREATE TABLE "ChatConversation" (
    "id" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatConversationMember" (
    "chatConversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT,

    PRIMARY KEY ("chatConversationId","userId")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachData" JSONB,
    "replyToId" TEXT,
    "chatConversationId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "fromOrgId" TEXT,
    "isRead" BOOLEAN DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingOrder" (
    "id" TEXT NOT NULL,
    "orderCustomId" TEXT,
    "orgId" TEXT NOT NULL,
    "payAmount" INTEGER DEFAULT 0,
    "totalAmount" INTEGER DEFAULT 0,
    "note" TEXT,
    "customerUserId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "systemStatus" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "attachedFiles" JSONB,
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingOrderItem" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "amount" INTEGER DEFAULT 0,
    "quantity" INTEGER DEFAULT 0,
    "pickupDateTime" TIMESTAMP(3),
    "returningDateTime" TIMESTAMP(3),
    "systemStatus" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "unitPrice" INTEGER DEFAULT 0,
    "unitPricePerDay" INTEGER DEFAULT 0,
    "unitPricePerWeek" INTEGER DEFAULT 0,
    "unitPricePerMonth" INTEGER DEFAULT 0,
    "attachedFiles" JSONB,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "itemId" TEXT,
    "orgId" TEXT NOT NULL,
    "rentingOrderId" TEXT NOT NULL,
    "customerUserId" TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingDepositItem" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "systemType" TEXT NOT NULL,
    "note" TEXT,
    "valueAmount" INTEGER DEFAULT 0,
    "attachedFiles" JSONB,
    "systemStatus" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rentingOrderId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "customerUserId" TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgTransactionHistory" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "refundToTransactionId" TEXT,
    "payAmount" INTEGER DEFAULT 0,
    "refId" TEXT,
    "note" TEXT,
    "attachedFiles" JSONB,
    "systemMethod" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "transactionOwner" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgRentingOrderItemTransactionHistory" (
    "orgTransactionHistoryId" TEXT NOT NULL,
    "rentingOrderItemId" TEXT NOT NULL,
    "itemId" TEXT,
    "type" TEXT,

    PRIMARY KEY ("orgTransactionHistoryId")
);

-- CreateTable
CREATE TABLE "OrgRentingOrderTransactionHistory" (
    "orgTransactionHistoryId" TEXT NOT NULL,
    "rentingOrderId" TEXT NOT NULL,
    "type" TEXT,

    PRIMARY KEY ("orgTransactionHistoryId")
);

-- CreateTable
CREATE TABLE "OrgActivityLog" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentingOrderOrgActivityLog" (
    "orgActivityLogId" TEXT NOT NULL,
    "rentingOrderId" TEXT NOT NULL,

    PRIMARY KEY ("orgActivityLogId")
);

-- CreateTable
CREATE TABLE "ItemOrgActivityLog" (
    "orgActivityLogId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    PRIMARY KEY ("orgActivityLogId")
);

-- CreateTable
CREATE TABLE "CustomerOrgActivityLog" (
    "orgActivityLogId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    PRIMARY KEY ("orgActivityLogId")
);

-- CreateTable
CREATE TABLE "EmployeeOrgActivityLog" (
    "orgActivityLogId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    PRIMARY KEY ("orgActivityLogId")
);

-- CreateTable
CREATE TABLE "CommonAttributesConfig" (
    "description" TEXT,
    "value" TEXT NOT NULL,
    "parentAttributeValue" TEXT,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "customConfigs" JSONB,
    "mapWithSystemValue" TEXT,
    "isDisabled" BOOLEAN DEFAULT false,
    "isDefault" BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    "orgId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY ("orgId","type","value")
);

-- CreateTable
CREATE TABLE "OrgCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" JSONB,
    "coverImage" JSONB,
    "parentCategoryId" TEXT,
    "order" INTEGER DEFAULT 0,
    "isDisabled" BOOLEAN DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "orgId" TEXT NOT NULL,
    "categoryId" TEXT,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgOrderStatistics" (
    "entryDateTime" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,
    "rentingOrderAmount" INTEGER DEFAULT 0,
    "rentingOrderPayAmount" INTEGER DEFAULT 0,
    "rentingOrderRefundAmount" INTEGER DEFAULT 0,
    "rentingNewOrderCount" INTEGER DEFAULT 0,
    "rentingReservedOrderCount" INTEGER DEFAULT 0,
    "rentingPickedUpOrderCount" INTEGER DEFAULT 0,
    "rentingReturnedOrderCount" INTEGER DEFAULT 0,
    "rentingCancelledOrderCount" INTEGER DEFAULT 0,

    PRIMARY KEY ("orgId","entryDateTime")
);

-- CreateTable
CREATE TABLE "OrgCategoryStatistics" (
    "entryDateTime" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,
    "orgCategoryId" TEXT NOT NULL,
    "newRentingOrderCount" INTEGER DEFAULT 0,
    "cancelledRentingOrderCount" INTEGER DEFAULT 0,
    "returnedRentingOrderCount" INTEGER DEFAULT 0,
    "viewCount" INTEGER DEFAULT 0,
    "amount" INTEGER DEFAULT 0,

    PRIMARY KEY ("orgId","entryDateTime","orgCategoryId")
);

-- CreateTable
CREATE TABLE "OrgItemStatistics" (
    "entryDateTime" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "newRentingOrderCount" INTEGER DEFAULT 0,
    "cancelledRentingOrderCount" INTEGER DEFAULT 0,
    "returnedRentingOrderCount" INTEGER DEFAULT 0,
    "viewCount" INTEGER DEFAULT 0,
    "amount" INTEGER DEFAULT 0,
    "payDamagesAmount" INTEGER DEFAULT 0,
    "refundDamagesAmount" INTEGER DEFAULT 0,

    PRIMARY KEY ("orgId","entryDateTime","itemId")
);

-- CreateTable
CREATE TABLE "OrgCustomerTradeTrackingCountStatistics" (
    "entryDateTime" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,
    "customerCount" INTEGER DEFAULT 0,

    PRIMARY KEY ("orgId","entryDateTime")
);

-- CreateTable
CREATE TABLE "OrgCustomerStatistics" (
    "entryDateTime" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,
    "newCount" INTEGER DEFAULT 0,
    "returnCount" INTEGER DEFAULT 0,

    PRIMARY KEY ("orgId","entryDateTime")
);

-- CreateTable
CREATE TABLE "_AreaToOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EmployeeToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
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

-- CreateTable
CREATE TABLE "_ItemToOrgCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization.slug_unique" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization.domain_unique" ON "Organization"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Employee.userId_orgId_unique" ON "Employee"("userId", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer.userId_orgId_unique" ON "Customer"("userId", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer.id_orgId_unique" ON "Customer"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.phoneNumber_unique" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User.currentHashedRefreshToken_unique" ON "User"("currentHashedRefreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "User.facebookId_unique" ON "User"("facebookId");

-- CreateIndex
CREATE UNIQUE INDEX "User.googleId_unique" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Role.orgId_id_unique" ON "Role"("orgId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Area.slug_unique" ON "Area"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category.slug_unique" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "file_storage_main_index" ON "FileStorage"("folderName", "createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Item.pid_unique" ON "Item"("pid");

-- CreateIndex
CREATE INDEX "item_main_index" ON "Item"("status", "isDeleted", "isVerified", "keyword");

-- CreateIndex
CREATE INDEX "item_created_date_index" ON "Item"("createdDate");

-- CreateIndex
CREATE INDEX "item_keyword_index" ON "Item"("keyword");

-- CreateIndex
CREATE INDEX "item_owner_user_index" ON "Item"("ownerUserId");

-- CreateIndex
CREATE INDEX "request_owner_user_index" ON "RentingItemRequest"("ownerUserId");

-- CreateIndex
CREATE INDEX "request_lender_user_index" ON "RentingItemRequest"("lenderUserId");

-- CreateIndex
CREATE INDEX "request_item_index" ON "RentingItemRequest"("itemId");

-- CreateIndex
CREATE INDEX "review_owner_user_index" ON "ItemReview"("createdBy");

-- CreateIndex
CREATE INDEX "review_item_index" ON "ItemReview"("itemId");

-- CreateIndex
CREATE INDEX "user_review_by_user_index" ON "UserReview"("toUserId");

-- CreateIndex
CREATE INDEX "renting_request_id_index" ON "RentingItemRequestActivity"("rentingItemRequestId");

-- CreateIndex
CREATE INDEX "login_log_owner_user_index" ON "UserLoginLog"("ownerUserId");

-- CreateIndex
CREATE INDEX "user_notification_index" ON "UserNotification"("createdDate");

-- CreateIndex
CREATE INDEX "notification_for_user_index" ON "UserNotification"("forUserId");

-- CreateIndex
CREATE INDEX "user_chat_message_index" ON "ChatMessage"("replyToId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_replyToId_unique" ON "ChatMessage"("replyToId");

-- CreateIndex
CREATE INDEX "selling_order_status_index" ON "RentingOrder"("orgId", "status");

-- CreateIndex
CREATE INDEX "org_transaction_ref_id_index" ON "OrgTransactionHistory"("refId");

-- CreateIndex
CREATE INDEX "org_transaction_refund_to_transaction_id_index" ON "OrgTransactionHistory"("refundToTransactionId");

-- CreateIndex
CREATE INDEX "org_renting_order_item_transaction_history_type" ON "OrgRentingOrderItemTransactionHistory"("type");

-- CreateIndex
CREATE INDEX "org_renting_order_transaction_history_type" ON "OrgRentingOrderTransactionHistory"("type");

-- CreateIndex
CREATE INDEX "common_attributes_org_type_index" ON "CommonAttributesConfig"("orgId", "type");

-- CreateIndex
CREATE INDEX "common_attributes_org_parent_attribute_index" ON "CommonAttributesConfig"("orgId", "parentAttributeValue");

-- CreateIndex
CREATE INDEX "common_attributes_map_system_value_index" ON "CommonAttributesConfig"("orgId", "mapWithSystemValue");

-- CreateIndex
CREATE UNIQUE INDEX "OrgCategory.orgId_slug_unique" ON "OrgCategory"("orgId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "_AreaToOrganization_AB_unique" ON "_AreaToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaToOrganization_B_index" ON "_AreaToOrganization"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToRole_AB_unique" ON "_EmployeeToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToRole_B_index" ON "_EmployeeToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AreaToItem_AB_unique" ON "_AreaToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaToItem_B_index" ON "_AreaToItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToItem_AB_unique" ON "_CategoryToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToItem_B_index" ON "_CategoryToItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToOrgCategory_AB_unique" ON "_ItemToOrgCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToOrgCategory_B_index" ON "_ItemToOrgCategory"("B");

-- AddForeignKey
ALTER TABLE "Organization" ADD FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInfo" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingItemRequest" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingItemRequest" ADD FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingItemRequest" ADD FOREIGN KEY ("lenderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemReview" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemReview" ADD FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD FOREIGN KEY ("createdByOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingItemRequestActivity" ADD FOREIGN KEY ("rentingItemRequestId") REFERENCES "RentingItemRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD FOREIGN KEY ("forUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishingItem" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MyUserContact" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatConversationMember" ADD FOREIGN KEY ("chatConversationId") REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD FOREIGN KEY ("replyToId") REFERENCES "ChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD FOREIGN KEY ("chatConversationId") REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrder" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrder" ADD FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderItem" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderItem" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderItem" ADD FOREIGN KEY ("rentingOrderId") REFERENCES "RentingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderItem" ADD FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingDepositItem" ADD FOREIGN KEY ("rentingOrderId") REFERENCES "RentingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingDepositItem" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingDepositItem" ADD FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgTransactionHistory" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgTransactionHistory" ADD FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgTransactionHistory" ADD FOREIGN KEY ("transactionOwner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgRentingOrderItemTransactionHistory" ADD FOREIGN KEY ("orgTransactionHistoryId") REFERENCES "OrgTransactionHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgRentingOrderItemTransactionHistory" ADD FOREIGN KEY ("rentingOrderItemId") REFERENCES "RentingOrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgRentingOrderItemTransactionHistory" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgRentingOrderTransactionHistory" ADD FOREIGN KEY ("orgTransactionHistoryId") REFERENCES "OrgTransactionHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgRentingOrderTransactionHistory" ADD FOREIGN KEY ("rentingOrderId") REFERENCES "RentingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgActivityLog" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgActivityLog" ADD FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderOrgActivityLog" ADD FOREIGN KEY ("orgActivityLogId") REFERENCES "OrgActivityLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentingOrderOrgActivityLog" ADD FOREIGN KEY ("rentingOrderId") REFERENCES "RentingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrgActivityLog" ADD FOREIGN KEY ("orgActivityLogId") REFERENCES "OrgActivityLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrgActivityLog" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrgActivityLog" ADD FOREIGN KEY ("orgActivityLogId") REFERENCES "OrgActivityLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrgActivityLog" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeOrgActivityLog" ADD FOREIGN KEY ("orgActivityLogId") REFERENCES "OrgActivityLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeOrgActivityLog" ADD FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonAttributesConfig" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgCategory" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgCategory" ADD FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgOrderStatistics" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgCategoryStatistics" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgCategoryStatistics" ADD FOREIGN KEY ("orgCategoryId") REFERENCES "OrgCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgItemStatistics" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgItemStatistics" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgCustomerTradeTrackingCountStatistics" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgCustomerStatistics" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToOrganization" ADD FOREIGN KEY ("A") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToOrganization" ADD FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToRole" ADD FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToRole" ADD FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD FOREIGN KEY ("A") REFERENCES "Permission"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToItem" ADD FOREIGN KEY ("A") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToItem" ADD FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToOrgCategory" ADD FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToOrgCategory" ADD FOREIGN KEY ("B") REFERENCES "OrgCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
