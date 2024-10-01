-- CreateTable
CREATE TABLE "teacher_lessons" (
    "id" SERIAL NOT NULL,
    "group" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "descipline" TEXT NOT NULL,
    "status" "StatusLesson" NOT NULL DEFAULT 'JOINED',
    "date" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "teacher" INTEGER NOT NULL,

    CONSTRAINT "teacher_lessons_pkey" PRIMARY KEY ("id")
);
