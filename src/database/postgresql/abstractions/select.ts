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

    console.log(group, currentDay);

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


export const selectLessonsTeacher = async (teacher: string, isTomorrow: boolean) => {
    const teacherId = await prisma.teachers.findFirst({
        where: {
            initials: teacher
        }
    });

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
            teacher: teacherId?.id
        },
        orderBy: {
            count: "asc"
        }
    });


    const updatedLessons = lessons.map(lesson => {
        if (!lesson.teacher) {
            const subGroup1Lesson = lessons.find(l => l.status === 'SubGroup1' && l.teacher);
            const subGroup2Lesson = lessons.find(l => l.status === 'SubGroup2' && l.teacher);

            lesson.teacher = subGroup1Lesson?.teacher || subGroup2Lesson?.teacher || null;
        }
        return lesson;
    });

    return updatedLessons;
}