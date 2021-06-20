-- CreateEnum
CREATE TYPE "PaymentMethodSystemType" AS ENUM ('PromoCode', 'RewardPoints', 'COD', 'BankTransfer', 'Card', 'Cash', 'MobileMoney');

-- AlterTable
ALTER TABLE "RentingOrderItem" ADD COLUMN     "payAmount" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "OrgPaymentHistory" (
    "id" TEXT NOT NULL,
    "rentingOrderId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "payAmount" INTEGER DEFAULT 0,
    "systemMethod" "PaymentMethodSystemType" NOT NULL,
    "method" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrgPaymentHistory" ADD FOREIGN KEY ("rentingOrderId") REFERENCES "RentingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgPaymentHistory" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgPaymentHistory" ADD FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
