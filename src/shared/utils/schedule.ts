import { LessonStatus } from "@typescript/enums";

interface ILesson {
    id: number;
    group: string;
    count: number;
    descipline: string;
    status: "JOINED" | "SubGroup1" | "SubGroup2";
    date: string;
    room: string;
}


export const replaceRoom = (text: string, lesson: ILesson) => {
    const descipline = isNaN(Number(lesson.descipline)) ? lesson.descipline : lesson.room;
    const count = isNaN(Number(lesson.descipline)) ? lesson.count : lesson.descipline;
    const room = isNaN(Number(lesson.descipline)) ? lesson.room : "";

    if (lesson.status === LessonStatus.Joined) text += `<b>Пара: ${count}</b>\n  Дисциплина: ${descipline}\n   Кабинет: ${room}\n\n`;
    if (lesson.status === LessonStatus.SubGroup1) text += `<b>Пара: ${count}</b>\n  Дисциплина: ${descipline}\n   Первая подгруппа: ${room} каб.\n`;
    if (lesson.status === LessonStatus.SubGroup2) text += `   Вторая подгруппа: ${room} каб.\n\n`;

    return text;
}