/*
  Warnings:

  - The `description` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `termAndCondition` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- 
ALTER TABLE "Item" ADD COLUMN "descriptionBackup" TEXT;
ALTER TABLE "Item" ADD COLUMN "termAndConditionBackup" TEXT;
-- Backup Data
UPDATE "Item" set "descriptionBackup" = "description";
UPDATE "Item" set "termAndConditionBackup" = "termAndCondition";

ALTER TABLE "Item" DROP COLUMN "description",
ADD COLUMN     "description" JSONB,
DROP COLUMN "termAndCondition",
ADD COLUMN     "termAndCondition" JSONB;

UPDATE "Item" set "description" = "descriptionBackup"::json;
UPDATE "Item" set "termAndCondition" = "termAndConditionBackup"::json;

ALTER TABLE "Item" DROP COLUMN "descriptionBackup";
ALTER TABLE "Item" DROP COLUMN "termAndConditionBackup";