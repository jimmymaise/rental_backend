/*
  Warnings:

  - You are about to drop the `MyUserContact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MyUserContact" DROP CONSTRAINT "MyUserContact_userId_fkey";

-- DropTable
DROP TABLE "MyUserContact";

-- CreateTable
CREATE TABLE "MyContactBook" (
    "ownerUserId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("ownerUserId","type","contactId")
);
