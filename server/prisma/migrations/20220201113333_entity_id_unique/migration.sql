/*
  Warnings:

  - A unique constraint covering the columns `[entityId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_entityId_key" ON "Like"("entityId");
