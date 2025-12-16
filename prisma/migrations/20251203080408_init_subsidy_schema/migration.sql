-- CreateTable
CREATE TABLE "Subsidy" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "target" TEXT,
    "region" TEXT,
    "amount" TEXT,
    "period" TEXT,
    "fullDescription" TEXT,
    "requirements" TEXT,
    "applicationMethod" TEXT,
    "requiredDocs" TEXT,
    "contactInfo" TEXT,
    "hostOrg" TEXT,
    "serviceUrl" TEXT,
    "gov24Url" TEXT,
    "searchUrl" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subsidy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalCount" INTEGER NOT NULL,
    "newCount" INTEGER NOT NULL,
    "updatedCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subsidy_serviceId_key" ON "Subsidy"("serviceId");

-- CreateIndex
CREATE INDEX "Subsidy_category_idx" ON "Subsidy"("category");

-- CreateIndex
CREATE INDEX "Subsidy_region_idx" ON "Subsidy"("region");

-- CreateIndex
CREATE INDEX "Subsidy_createdAt_idx" ON "Subsidy"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
