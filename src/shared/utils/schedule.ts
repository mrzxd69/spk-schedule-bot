import { LessonStatus } from "@typescript/enums";
import type { ILesson } from "../types/schedule";
import { prisma } from "@src/database/postgresql/prisma";

interface IProcessingLessonParams {
    text: string;
    lesson: ILesson;
    group: string;
    isTeacher?: boolean;
    date: string
}

export const processingLesson = async (data: IProcessingLessonParams) => {
    const { count, descipline, room, teacher } = data.lesson;
    let teacherName = "";
    let otherSubGroup: null | any = null;

    if (teacher) {
        const teacherEntity = await prisma.teachers.findFirst({
            where: {
                id: teacher,
            },
        });

        teacherName = teacherEntity?.initials || "";
    }

    if (data.lesson.status === LessonStatus.SubGroup2) {
        otherSubGroup = await prisma.lessons.findFirst({
            where: {
                group: data.group,
                date: data.date,
                status: "SubGroup1",
                descipline: descipline
            }
        });
        console.log(otherSubGroup)
    }

    const teacherText = !data.isTeacher && teacherName ? `\n   Ведёт: <i>${teacherName}</i>` : "";

    if (data.lesson.status === LessonStatus.Joined) data.text += `\n<b>${count === 0 ? "Промежуточ." : "Пара: " + count}</b>\n  ${descipline}\n   Кабинет: <b>${room}</b>${teacherText}\n`;
    if (data.lesson.status === LessonStatus.SubGroup1) data.text += `\n<b>Пара: ${count}</b>\n  ${descipline}\n   [1] - <b>${room}</b>${teacherText.replace("\n   Ведёт: ", " | ")}\n`;
    if (data.lesson.status === LessonStatus.SubGroup2) data.text += `   [2] - <b>${room}</b>${teacherText.replace("\n   Ведёт: ", " | ")}\n`

    return data.text;
};

export const getScheduleText = async (text: string, lessons: any, group: string, date: string, isTeacher: boolean = false) => {
    const replacedLessons = await Promise.all(lessons.map(async (lesson: ILesson) => await processingLesson({
        text,
        lesson,
        group,
        isTeacher,
        date
    })));

    return replacedLessons.join("");
};
