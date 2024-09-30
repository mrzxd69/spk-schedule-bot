/*
  Warnings:

  - Added the required column `room` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "room" TEXT NOT NULL;
