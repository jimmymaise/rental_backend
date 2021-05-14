/*
  Warnings:

  - The primary key for the `CommonAttributesConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CommonAttributesConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CommonAttributesConfig" DROP CONSTRAINT "CommonAttributesConfig_pkey",
DROP COLUMN "id",
ADD PRIMARY KEY ("orgId", "value");

-- CreateIndex
CREATE INDEX "common_attributes_map_system_value_index" ON "CommonAttributesConfig"("orgId", "mapWithSystemValue");
