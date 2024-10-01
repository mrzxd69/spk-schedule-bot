import { prisma } from "@postgresql/prisma";
import {
    processingLesson,
    processingTeacherLesson
} from "@shared/newsletter/processing/database"
import {
    sendGroupSchedule,
    sendTeachersSchedule
} from "@shared/newsletter/telegram";


const subGroupTeachers: any = {
    "(2гр)": "SubGroup2",
    "(1гр)": "SubGroup1",
    "": "JOINED"
}

const generateInitialTextGroup = async (group: string, date: string) => {
    const existDate = await prisma.lessons.findFirst({
        where: { date, group }
    });

    return existDate
        ? `♻️ ИЗМЕНЕНИЯ РАСПИСАНИЯ НА ${date}\n\n`
        : `🖇 <b>Группа: </b> ${group}\n⏳ <b>Дата: </b> ${date}\n\n`;
}

const generateInitialTextTeacher = async (teacher: string, date: string) => {
    const teacherId = await prisma.teachers.findFirst({
        select: {
            id: true
        },
        where: {
            initials: teacher
        }
    });

    const existDate = await prisma.lessons.findFirst({
        where: {
            date,
            teacher: teacherId?.id
        }
    });

    return existDate
        ? `♻️ ИЗМЕНЕНИЯ РАСПИСАНИЯ НА ${date}\n\n`
        : `🗓 Расписание на: ${date}\n\n`;
}

export const addLessonsStudents = async (lessons: any[], date: string) => {
    for (const section of lessons) {
        for (const group in section) {
            let text = await generateInitialTextGroup(group, date);
            let allRecordsExist = true;

            if (group.length < 13) {
                for (const lesson in section[group]) {
                    const lessonValue = section[group][lesson];

                    const resultRow = await getRowLesson(group, date, lesson, lessonValue);

                    text += resultRow.text;
                    if (!resultRow.stateRecordsExist) allRecordsExist = false;
                }

                if (!allRecordsExist) {
                    await sendGroupSchedule(group, text);
                }
            }
        }
    }
}


const getRowLesson = async (group: string, date: string, lesson: string, lessonValue: any) => {
    let text = "";
    let allRecordsExist = true;

    if (lessonValue.length === 1) {
        const lessonRow = await processingLesson(group, date, lesson, lessonValue)

        if (lessonRow) {
            const {
                allRecordsExist: stateLessons,
                text: lessonText
            } = lessonRow;

            if (!stateLessons) {
                allRecordsExist = stateLessons;
                text += lessonText;
            }
        }
    }

    if (lessonValue.length === 2) {
        const lessonRow = await processingLesson(group, date, lesson, lessonValue)

        if (lessonRow) {
            const {
                allRecordsExist: stateLessons,
                text: lessonText
            } = lessonRow;

            if (!stateLessons) {
                allRecordsExist = stateLessons;
                text += lessonText;
            }
        }
    }

    return {
        text,
        stateRecordsExist: allRecordsExist
    }
}


export const addLessonsTeachers = async (data: any[], date: string) => {
    for (const teacher in data) {
        const teacherId = await prisma.teachers.findFirst({
            select: {
                id: true
            },
            where: {
                initials: teacher
            }
        });

        if (!teacherId) continue;

        const users = await prisma.users.findMany({
            where: {
                teacher: teacherId.id
            }
        });

        const {
            stateAllRecordExist,
            text
        } = await generateTeacherScheduleText(teacher, data[teacher], date);


        if (!stateAllRecordExist) {
            await sendTeachersSchedule(users, text);
        }
    }
}

const generateTeacherScheduleText = async (teacher: string, teacherData: any, date: string) => {
    let text = await generateInitialTextTeacher(teacher, date);

    return processingTeacherLesson(
        text,
        teacher,
        teacherData,
        date
    );
}
