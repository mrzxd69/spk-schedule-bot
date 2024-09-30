-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_convId_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_userId_fkey";

-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "convId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_convId_fkey" FOREIGN KEY ("convId") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
