import { prisma } from "@postgresql/prisma";
import { 
    processingLesson
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

const generateInitialText = async(group: string, date: string) => {
    const existDate = await prisma.lessons.findFirst({
		where: { date, group }
	});

	return existDate 
		? `♻️ ИЗМЕНЕНИЯ РАСПИСАНИЯ НА ${date}\n\n`
		: `🖇 <b>Группа: </b> ${group}\n⏳ <b>Дата: </b> ${date}\n\n`;
}

export const addLessonsStudents = async(lessons: any[], date: string) => {
    for (const section of lessons) {
		for (const group in section) {
			let text = await generateInitialText(group, date);
			let allRecordsExist = true;

            if(group.length < 13) {
                for (const lesson in section[group]) {
                    const lessonValue = section[group][lesson];

                    const resultRow = await getRowLesson(group, date, lesson, lessonValue);

                    text += resultRow.text;
                    if (!resultRow.stateRecordsExist) allRecordsExist = false;
                }

                if(!allRecordsExist) {
                    await sendGroupSchedule(group, text);
                }
            }
        }
    }
}


const getRowLesson = async(group: string, date: string, lesson: string, lessonValue: any) => {
    let text = "";
    let allRecordsExist = true;

    if(lessonValue.length === 1) {
        const lessonRow = await processingLesson(group, date, lesson, lessonValue)

        if(lessonRow) {
            const {
                allRecordsExist: stateLessons,
                text: lessonText
            } = lessonRow;

            if(!stateLessons) {
                allRecordsExist = stateLessons;
                text += lessonText;
            }
        }
    }

    if(lessonValue.length === 2) {
        const lessonRow = await processingLesson(group, date, lesson, lessonValue)

        if(lessonRow) {
            const {
                allRecordsExist: stateLessons,
                text: lessonText
            } = lessonRow;

            if(!stateLessons) {
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
		const text = await generateTeacherScheduleText(teacher, data[teacher], date);

		await sendTeachersSchedule(users, text);
	}
}

const generateTeacherScheduleText = async (teacher: string, teacherData: any, date: string) => {
	let text = `🗓 Расписание на: ${date}\n\n`;

	const lessons = Object.keys(teacherData);
	for (const lesson of lessons) {
		const lessonDetails = await getLessonDetails(lesson, teacherData[lesson]);
		text += formatLessonText(lesson, lessonDetails);
	}

	return text;
}

const getLessonDetails = async (lesson: string, lessonData: string) => {
	const count = Number(lesson.split(" ")[0]);
	const group = lessonData.split(" ")[0];
	const subGroup = subGroupTeachers[lessonData.split(" ")[1]];

	const room = await prisma.lessons.findFirst({
		where: { 
            count, 
            group, 
            status: subGroup 
        }
	});

	return { 
        group, 
        subGroup, 
        room: room ? room.room : "неизвестен" 
    };
}

const formatLessonText = (lesson: string, lessonDetails: { group: string; subGroup: string; room: string }) => {
	return `• <b>${lesson}</b>:\n  Группа: ${lessonDetails.group}\n  Кабинет: ${lessonDetails.room}\n\n`;
}