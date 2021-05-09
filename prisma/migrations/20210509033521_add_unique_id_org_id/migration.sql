/*
  Warnings:

  - A unique constraint covering the columns `[orgId,id]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role.orgId_id_unique" ON "Role"("orgId", "id");
