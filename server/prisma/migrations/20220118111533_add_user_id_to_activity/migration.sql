/*
  Warnings:

  - Added the required column `userId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "userId" INTEGER NOT NULL;
