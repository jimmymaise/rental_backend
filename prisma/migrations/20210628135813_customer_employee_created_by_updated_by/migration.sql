-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;
