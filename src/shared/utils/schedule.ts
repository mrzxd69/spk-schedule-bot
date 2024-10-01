import { LessonStatus } from "@typescript/enums";
import type { ILesson } from "../types/schedule";

export const replaceRoom = (text: string, lesson: ILesson) => {
    const { count, descipline, room } = lesson;

    if (lesson.status === LessonStatus.Joined) text += `<b>Пара: ${count}</b>\n  Дисциплина: ${descipline}\n   Кабинет: ${room}\n\n`;
    if (lesson.status === LessonStatus.SubGroup1) text += `<b>Пара: ${count}</b>\n  Дисциплина: ${descipline}\n   Первая подгруппа: ${room} каб.\n`;
    if (lesson.status === LessonStatus.SubGroup2) text += `   Вторая подгруппа: ${room} каб.\n\n`;

    return text;
}