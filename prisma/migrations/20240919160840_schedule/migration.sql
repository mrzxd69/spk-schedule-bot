-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_userId_fkey";

-- DropIndex
DROP INDEX "teachers_userId_key";

-- AlterTable
ALTER TABLE "teachers" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
