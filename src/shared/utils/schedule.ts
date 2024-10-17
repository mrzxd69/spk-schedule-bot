import { LessonStatus } from "@typescript/enums";
import type { ILesson } from "../types/schedule";
import { prisma } from "@src/database/postgresql/prisma";

interface IProcessingLessonParams {
    text: string;
    lesson: ILesson;
    lessonsList: { status: LessonStatus, text: string }[];
    isTeacher?: boolean;
}

export const processingLesson = async (data: IProcessingLessonParams) => {
    const { count, descipline, room, teacher } = data.lesson;
    const { lessonsList } = data;

    let teacherName = "";

    if (teacher) {
        const teacherEntity = await prisma.teachers.findFirst({
            where: {
                id: teacher,
            },
        });

        teacherName = teacherEntity?.initials || "";
    }

    const teacherText = !data.isTeacher && teacherName ? `\n   Ведёт: <i>${teacherName}</i>` : "";

    if (data.lesson.status === LessonStatus.Joined) {
        lessonsList.push({
            status: LessonStatus.Joined,
            text: `\n<b>${count === 0 ? "Промежуточ." : "Пара: " + count}</b>\n  ${descipline}\n   Кабинет: <b>${room}</b>${teacherText}\n`
        });
    }

    if (data.lesson.status === LessonStatus.SubGroup1) {
        console.log(data.lessonsList)
        lessonsList.push({
            status: LessonStatus.SubGroup1,
            text: `\n<b>Пара: ${count}</b>\n  ${descipline}\n   [1] - <b>${room}</b>${teacherText.replace("\n   Ведёт: ", " | ")}\n`
        });
    }

    if (data.lesson.status === LessonStatus.SubGroup2) {
        if (lessonsList[lessonsList.length - 1]?.status !== LessonStatus.SubGroup1) {
            lessonsList.push({
                status: LessonStatus.SubGroup1,
                text: `\n<b>Пара: ${count}</b>\n  ${descipline}\n   [2] - <b>${room}</b>${teacherText.replace("\n   Ведёт: ", " | ")}\n`
            })
        } else {
            lessonsList.push({
                status: LessonStatus.SubGroup2,
                text: `   [2] - <b>${room}</b>${teacherText.replace("\n   Ведёт: ", " | ")}\n`
            });
        }
    }
};

export const getScheduleText = async (text: string, lessons: any, isTeacher: boolean = false) => {
    let lessonsList: { status: LessonStatus, text: string }[] = [];

    await Promise.all(lessons.map(async (lesson: ILesson) => await processingLesson({
        text,
        lesson,
        isTeacher,
        lessonsList
    })));

    return lessonsList
        .map((lesson) => lesson.text)
        .join("");
};
