-- AlterTable
ALTER TABLE "CommonAttributesConfig" ADD COLUMN     "parentAttributeValue" TEXT;

-- CreateIndex
CREATE INDEX "common_attributes_org_parent_attribute_index" ON "CommonAttributesConfig"("orgId", "parentAttributeValue");
