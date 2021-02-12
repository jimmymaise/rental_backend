-- CreateIndex
CREATE INDEX "item_owner_user_index" ON "Item"("ownerUserId");

-- CreateIndex
CREATE INDEX "review_owner_user_index" ON "ItemReview"("ownerUserId");

-- CreateIndex
CREATE INDEX "review_item_index" ON "ItemReview"("itemId");

-- CreateIndex
CREATE INDEX "request_owner_user_index" ON "RentingItemRequest"("ownerUserId");

-- CreateIndex
CREATE INDEX "request_lender_user_index" ON "RentingItemRequest"("lenderUserId");

-- CreateIndex
CREATE INDEX "request_item_index" ON "RentingItemRequest"("itemId");

-- CreateIndex
CREATE INDEX "renting_request_id_index" ON "RentingItemRequestActivity"("rentingItemRequestId");

-- CreateIndex
CREATE INDEX "user_identify_document_index" ON "UserIdentifyDocument"("userId");

-- CreateIndex
CREATE INDEX "login_log_owner_user_index" ON "UserLoginLog"("ownerUserId");

-- CreateIndex
CREATE INDEX "notification_for_user_index" ON "UserNotification"("forUserId");

-- CreateIndex
CREATE INDEX "user_review_owner_user_index" ON "UserReview"("ownerUserId");

-- CreateIndex
CREATE INDEX "user_review_to_user_index" ON "UserReview"("toUserId");
