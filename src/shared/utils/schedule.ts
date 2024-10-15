import { LessonStatus } from "@typescript/enums";
import type { ILesson } from "../types/schedule";
import { prisma } from "@src/database/postgresql/prisma";

export const processingLesson = async (text: string, lesson: any, isTeacher: boolean = false) => {
    const { count, descipline, room, teacher } = lesson;
    let teacherName = "";

    if (teacher) {
        const teacherEntity = await prisma.teachers.findFirst({
            where: {
                id: teacher,
            },
        });

        teacherName = teacherEntity?.initials || "";
    }

    const teacherText = !isTeacher && teacherName ? `\n   Ведёт: <i>${teacherName}</i>` : "";

    if (lesson.status === LessonStatus.Joined) text += `\n<b>${count === 0 ? "Промежуточ." : "Пара: " + count}</b>\n  ${descipline}\n   Кабинет: <b>${room}</b>${teacherText}\n`;
    if (lesson.status === LessonStatus.SubGroup1) text += `\n<b>Пара: ${count}</b>\n  ${descipline}\n   [1] - <b>${room}</b>${teacherText.replace("\n   Ведёт: ", " | ")}\n`;
    if (lesson.status === LessonStatus.SubGroup2) text += `   [2] - <b>${room}</b>${teacherText.replace("\n   Ведёт: ", " | ")}\n`;

    return text;
};

export const getScheduleText = async (text: string, lessons: any, isTeacher: boolean = false) => {
    const replacedLessons = await Promise.all(lessons.map(async (lesson: ILesson) => await processingLesson(text, lesson, isTeacher)));

    return replacedLessons.join("");
};
