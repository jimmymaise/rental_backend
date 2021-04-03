/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[pid]` on the table `Item`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "pid" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item.pid_unique" ON "Item"("pid");
