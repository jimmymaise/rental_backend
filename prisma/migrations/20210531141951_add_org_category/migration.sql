-- CreateTable
CREATE TABLE "OrgCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" JSONB,
    "coverImage" JSONB,
    "parentCategoryId" TEXT,
    "order" INTEGER DEFAULT 0,
    "isDisabled" BOOLEAN DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "orgId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemToOrgCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OrgCategory.orgId_slug_unique" ON "OrgCategory"("orgId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToOrgCategory_AB_unique" ON "_ItemToOrgCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToOrgCategory_B_index" ON "_ItemToOrgCategory"("B");

-- AddForeignKey
ALTER TABLE "OrgCategory" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToOrgCategory" ADD FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToOrgCategory" ADD FOREIGN KEY ("B") REFERENCES "OrgCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
