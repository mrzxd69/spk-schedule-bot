import { format as formatTime } from '@formkit/tempo';
import { prisma } from '../prisma';

export const selectLessons = async (group: string, isTomorrow: boolean) => {
    const date = new Date()

    date.setDate(date.getDate() + (isTomorrow ? 1 : 0));

    const currentDay = formatTime({
        date: date,
        format: "DD.MM",
        tz: "Asia/Omsk"
    });

    const lessons = await prisma.lessons.findMany({
        where: {
            date: currentDay,
            group: group
        },
        orderBy: {
            id: "asc"
        }
    });
    console.log(lessons)

    return lessons
}