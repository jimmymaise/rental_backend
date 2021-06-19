-- CreateTable
CREATE TABLE "OrgDailyOrderStatistics" (
    "entryDateTime" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,
    "rentingOrderAmount" INTEGER DEFAULT 0,
    "rentingNewOrderCount" INTEGER DEFAULT 0,
    "rentingReservedOrderCount" INTEGER DEFAULT 0,
    "rentingPickedUpOrderCount" INTEGER DEFAULT 0,
    "rentingReturnedUpOrderCount" INTEGER DEFAULT 0,
    "rentingCancelledOrderCount" INTEGER DEFAULT 0,

    PRIMARY KEY ("entryDateTime")
);

-- CreateTable
CREATE TABLE "OrgDailyCategoryStatistics" (
    "entryDateTime" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,
    "orgCategoryId" TEXT,
    "newRentingOrderCount" INTEGER DEFAULT 0,
    "cancelledRentingOrderCount" INTEGER DEFAULT 0,
    "viewCount" INTEGER DEFAULT 0,
    "amount" INTEGER DEFAULT 0,

    PRIMARY KEY ("entryDateTime")
);

-- CreateTable
CREATE TABLE "OrgDailyItemStatistics" (
    "entryDateTime" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "newRentingOrderCount" INTEGER DEFAULT 0,
    "cancelledRentingOrderCount" INTEGER DEFAULT 0,
    "viewCount" INTEGER DEFAULT 0,
    "amount" INTEGER DEFAULT 0,
    "debtAmount" INTEGER DEFAULT 0,
    "payAmount" INTEGER DEFAULT 0,

    PRIMARY KEY ("entryDateTime")
);

-- CreateTable
CREATE TABLE "OrgDailyCustomerTradeCountStatistics" (
    "id" TEXT NOT NULL,
    "entryDateTime" TIMESTAMP(3) NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "orgId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "org_daily_customer_trade_count_statistics_entry_date_time_index" ON "OrgDailyCustomerTradeCountStatistics"("entryDateTime");

-- AddForeignKey
ALTER TABLE "OrgDailyOrderStatistics" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgDailyCategoryStatistics" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgDailyCategoryStatistics" ADD FOREIGN KEY ("orgCategoryId") REFERENCES "OrgCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgDailyItemStatistics" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgDailyItemStatistics" ADD FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgDailyCustomerTradeCountStatistics" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
