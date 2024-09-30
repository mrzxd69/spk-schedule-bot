/*
  Warnings:

  - You are about to drop the column `period` on the `lessons` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusLesson" AS ENUM ('JOINED', 'SubGroup1', 'SubGroup2');

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "period",
ADD COLUMN     "status" "StatusLesson" NOT NULL DEFAULT 'JOINED';
