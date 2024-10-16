-- CreateTable
CREATE TABLE "edits" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "status" "StatusLesson" NOT NULL DEFAULT 'JOINED',
    "group" TEXT NOT NULL,
    "teacher" INTEGER,

    CONSTRAINT "edits_pkey" PRIMARY KEY ("id")
);
