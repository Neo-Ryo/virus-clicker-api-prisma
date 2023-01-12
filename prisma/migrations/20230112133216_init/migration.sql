-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamUuid" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Team" (
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sprite" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_uuid_key" ON "Team"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamUuid_fkey" FOREIGN KEY ("teamUuid") REFERENCES "Team"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
