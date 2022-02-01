/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Like` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Like" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
