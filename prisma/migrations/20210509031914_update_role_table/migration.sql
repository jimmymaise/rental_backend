/*
  Warnings:

  - You are about to drop the `_OrganizationToRole` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `orgId` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_OrganizationToRole" DROP CONSTRAINT "_OrganizationToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationToRole" DROP CONSTRAINT "_OrganizationToRole_B_fkey";

-- DropIndex
DROP INDEX "Role.orgId_id_unique";

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "orgId" SET NOT NULL;

-- DropTable
DROP TABLE "_OrganizationToRole";

-- AddForeignKey
ALTER TABLE "Role" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
