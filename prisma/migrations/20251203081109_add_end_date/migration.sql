-- AlterTable
ALTER TABLE "Subsidy" ADD COLUMN     "endDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Subsidy_endDate_idx" ON "Subsidy"("endDate");
