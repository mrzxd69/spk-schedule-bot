/*
  Warnings:

  - You are about to drop the column `teacher` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the `edits` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "teacher";

-- DropTable
DROP TABLE "edits";

-- CreateTable
CREATE TABLE "teacher_lessons" (
    "id" SERIAL NOT NULL,
    "group" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "descipline" TEXT NOT NULL,
    "status" "StatusLesson" NOT NULL DEFAULT 'JOINED',
    "date" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "teacher" INTEGER,

    CONSTRAINT "teacher_lessons_pkey" PRIMARY KEY ("id")
);
