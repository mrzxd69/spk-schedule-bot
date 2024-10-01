/*
  Warnings:

  - You are about to drop the `teacher_lessons` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "teacher" INTEGER;

-- DropTable
DROP TABLE "teacher_lessons";
