-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "rentingStatus" TEXT;

-- CreateTable
CREATE TABLE "_AreaToOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AreaToOrganization_AB_unique" ON "_AreaToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaToOrganization_B_index" ON "_AreaToOrganization"("B");

-- AddForeignKey
ALTER TABLE "_AreaToOrganization" ADD FOREIGN KEY ("A") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToOrganization" ADD FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
