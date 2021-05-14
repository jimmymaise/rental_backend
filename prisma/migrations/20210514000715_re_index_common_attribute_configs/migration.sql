/*
  Warnings:

  - The primary key for the `CommonAttributesConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CommonAttributesConfig" DROP CONSTRAINT "CommonAttributesConfig_pkey",
ADD PRIMARY KEY ("orgId", "type", "value");

-- CreateIndex
CREATE INDEX "common_attributes_org_type_index" ON "CommonAttributesConfig"("orgId", "type");
