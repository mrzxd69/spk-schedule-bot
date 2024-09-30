/*
  Warnings:

  - Added the required column `notification_news` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notification_schedule` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "notification_news" BOOLEAN NOT NULL,
ADD COLUMN     "notification_schedule" BOOLEAN NOT NULL;
