/*
  Warnings:

  - The values [COD] on the enum `PaymentMethodSystemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethodSystemType_new" AS ENUM ('PromoCode', 'RewardPoints', 'BankTransfer', 'Card', 'Cash', 'MobileMoney', 'Other');
ALTER TABLE "OrgPaymentHistory" ALTER COLUMN "systemMethod" TYPE "PaymentMethodSystemType_new" USING ("systemMethod"::text::"PaymentMethodSystemType_new");
ALTER TYPE "PaymentMethodSystemType" RENAME TO "PaymentMethodSystemType_old";
ALTER TYPE "PaymentMethodSystemType_new" RENAME TO "PaymentMethodSystemType";
DROP TYPE "PaymentMethodSystemType_old";
COMMIT;
