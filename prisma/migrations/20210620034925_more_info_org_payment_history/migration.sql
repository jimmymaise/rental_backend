-- AlterTable
ALTER TABLE "OrgPaymentHistory" ADD COLUMN     "code" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "attachedFiles" JSONB;

-- CreateIndex
CREATE INDEX "org_payment_history_code_index" ON "OrgPaymentHistory"("code");
