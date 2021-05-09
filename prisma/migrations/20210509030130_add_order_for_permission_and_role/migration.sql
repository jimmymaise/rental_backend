-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "order" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "order" INTEGER DEFAULT 0;
