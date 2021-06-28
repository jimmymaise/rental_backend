-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isDisabled" BOOLEAN DEFAULT false,
ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "isDisabled" BOOLEAN DEFAULT false,
ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;
