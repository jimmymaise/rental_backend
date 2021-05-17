/*
  Warnings:

  - The values [SellingOrderItemStatus] on the enum `CommonAttributesType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommonAttributesType_new" AS ENUM ('SellingOrderStatus', 'RentingOrderItemStatus', 'RentingDepositItemStatus', 'RentingDepositItemType');
ALTER TABLE "CommonAttributesConfig" ALTER COLUMN "type" TYPE "CommonAttributesType_new" USING ("type"::text::"CommonAttributesType_new");
ALTER TYPE "CommonAttributesType" RENAME TO "CommonAttributesType_old";
ALTER TYPE "CommonAttributesType_new" RENAME TO "CommonAttributesType";
DROP TYPE "CommonAttributesType_old";
COMMIT;
