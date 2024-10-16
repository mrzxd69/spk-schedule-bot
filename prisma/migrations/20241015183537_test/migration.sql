/*
  Warnings:

  - Added the required column `date` to the `edits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "edits" ADD COLUMN     "date" TEXT NOT NULL;
