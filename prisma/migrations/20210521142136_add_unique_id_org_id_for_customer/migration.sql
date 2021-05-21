/*
  Warnings:

  - A unique constraint covering the columns `[id,orgId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer.id_orgId_unique" ON "Customer"("id", "orgId");
