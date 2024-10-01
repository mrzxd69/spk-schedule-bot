import { prisma } from "@postgresql/prisma";
import { existLessons } from "@postgresql/abstractions/schedule";

const subGroup: any = {
    1: ' Первая подгруппа',
    2: ' Вторая подгруппа',
    3: ' Третья подгруппа',
};

const subGroupTeachers: any = {
    "(2гр)": "SubGroup2",
    "(1гр)": "SubGroup1",
    "": "JOINED"
}

export const processingLesson = async (group: string, date: string, lesson: string, lessonValue: any[]) => {
    let allRecordsExist = true;
    let text = '';
    try {
        if (lessonValue.length === 1) {
            if (lessonValue[0].length === 3) {
                const exist = await existLessons({
                    count: Number(lesson),
                    group: group,
                    status: Number(lessonValue[0][1]) === 1 ? "SubGroup1" : "SubGroup2",
                    room: String(lessonValue[0][2]),
                    date: date
                });

                if (exist && exist.descipline !== lessonValue[0][0]) {
                    allRecordsExist = false;
                    text += `<b>${lesson} пара:</b>\n Дисциплина: ${lessonValue[0][0]}\n Кабинет: ${lessonValue[0][2]}\n  Только ${lessonValue[0][1]} группа!\n\n`;

                    await prisma.lessons.update({
                        where: {
                            id: exist.id
                        },
                        data: {
                            descipline: lessonValue[0][0]
                        }
                    });
                }


                if (!exist) {
                    allRecordsExist = false;
                    text += `<b>${lesson} пара:</b>\n Дисциплина: ${lessonValue[0][0]}\n Кабинет: ${lessonValue[0][2]}\n  Только ${lessonValue[0][1]} группа!\n\n`;

                    await prisma.lessons.create({
                        data: {
                            count: Number(lesson),
                            descipline: lessonValue[0][0],
                            group: group,
                            status: Number(lessonValue[0][1]) === 1 ? "SubGroup1" : "SubGroup2",
                            date: date,
                            room: String(lessonValue[0][2]),
                        }
                    });
                }
            }

            if (lessonValue[0].length === 1) {
                const exist = await existLessons({
                    count: 1,
                    group: group,
                    status: "JOINED",
                    date: date,
                    room: String(lessonValue[0][0])
                });

                if (!exist) {
                    allRecordsExist = false;
                    text += `<b>промежуточное:</b>\n Дисциплина: ${lesson}\n Кабинет: ${lessonValue[0][0]}\n\n`;

                    await prisma.lessons.create({
                        data: {
                            count: 1,
                            descipline: lesson,
                            group: group,
                            status: "JOINED",
                            date: date,
                            room: String(lessonValue[0][0])
                        }
                    });
                }
            }

            if (lessonValue[0].length === 2) {
                const exist = await existLessons({
                    count: Number(lesson),
                    group: group,
                    status: "JOINED",
                    date: date,
                    room: String(lessonValue[0][1])
                });

                if (exist && exist.descipline !== lessonValue[0][0]) {
                    allRecordsExist = false;
                    text += `<b>${lesson} пара:</b>\n Дисциплина: ${lessonValue[0][0]}\n Кабинет: ${lessonValue[0][1]}\n\n`;

                    await prisma.lessons.update({
                        where: {
                            id: exist.id
                        },
                        data: {
                            descipline: lessonValue[0][0]
                        }
                    });
                }

                if (!exist) {
                    allRecordsExist = false;
                    text += `<b>${lesson} пара:</b>\n Дисциплина: ${lessonValue[0][0]}\n Кабинет: ${lessonValue[0][1]}\n\n`;

                    await prisma.lessons.create({
                        data: {
                            count: Number(lesson),
                            descipline: lessonValue[0][0],
                            group: group,
                            status: "JOINED",
                            date: date,
                            room: String(lessonValue[0][1])
                        }
                    });
                }
            }
        }
        if (lessonValue.length === 2) {
            const existSubGroup1 = await existLessons({
                count: Number(lesson),
                group: group,
                status: Number(lessonValue[0][1]) === 1 ? "SubGroup1" : "SubGroup2",
                room: String(lessonValue[0][2]),
                date: date
            });

            const existSubGroup2 = await existLessons({
                count: Number(lesson),
                group: group,
                status: Number(lessonValue[1][1]) === 1 ? "SubGroup1" : "SubGroup2",
                room: String(lessonValue[1][2]),
                date: date
            });

            if (existSubGroup1 && existSubGroup1.descipline !== lessonValue[0][0]) {
                allRecordsExist = false;
                text += `<b>${lesson} пара:</b>\n  Дисциплина: ${lessonValue[0][0]}\n  ${subGroup[lessonValue[0][1]]}: ${lessonValue[0][2]} кабинет`;

                await prisma.lessons.update({
                    where: {
                        id: existSubGroup1.id
                    },
                    data: {
                        descipline: lessonValue[0][0]
                    }
                });
            }

            if (existSubGroup2 && existSubGroup2.descipline !== lessonValue[0][0]) {
                allRecordsExist = false;
                text += `\n  ${subGroup[lessonValue[1][1]]}: ${lessonValue[1][2]} кабинет\n\n`;

                await prisma.lessons.update({
                    where: {
                        id: existSubGroup2.id
                    },
                    data: {
                        descipline: lessonValue[0][0]
                    }
                });
            }


            if (!existSubGroup1 || !existSubGroup2) {
                allRecordsExist = false;
                text +=
                    `<b>${lesson} пара:</b>\n  Дисциплина: ${lessonValue[0][0]}\n  ${subGroup[lessonValue[0][1]]}: ${lessonValue[0][2]} кабинет\n  ${subGroup[lessonValue[1][1]]}: ${lessonValue[1][2]} кабинет\n\n`;

                await prisma.lessons.createMany({
                    data: [
                        {
                            count: Number(lesson),
                            descipline: lessonValue[0][0],
                            group: group,
                            status: Number(lessonValue[0][1]) === 1 ? "SubGroup1" : "SubGroup2",
                            room: String(lessonValue[0][2]),
                            date: date
                        },
                        {
                            count: Number(lesson),
                            descipline: lessonValue[0][0],
                            group: group,
                            status: Number(lessonValue[1][1]) === 1 ? "SubGroup1" : "SubGroup2",
                            room: String(lessonValue[1][2]),
                            date: date
                        }
                    ]
                });
            }
        }

        return {
            text,
            allRecordsExist
        }
    } catch (e) {
        console.log(e);
    }
}


export const processingTeacherLesson = async (text: string, teacher: string, teacherData: any, date: string) => {
    let allRecordsExist = true;

    for (const lesson in teacherData) {
        let [group, subGroup] = teacherData[lesson].split(" ");
        const count = lesson.split(" ")[0];

        subGroup = typeof subGroup === "undefined" ? "" : subGroup;

        const teacherExist = await prisma.teachers.findFirst({
            where: {
                initials: teacher
            }
        });

        if (!teacherExist) continue;

        const exist = await prisma.lessons.findFirst({
            where: {
                group,
                count: Number(count),
                status: subGroupTeachers[subGroup],
                date
            }
        });

        if (exist) {
            if (exist.teacher !== teacherExist.id) {
                allRecordsExist = false;
                text += `• <b>${lesson}</b>:\n Группа ${group}\n Кабинет: ${exist.room}\n\n`
                await prisma.lessons.update({
                    data: {
                        teacher: teacherExist.id
                    },
                    where: {
                        id: exist.id
                    }
                });
            }
        }
    }

    return {
        stateAllRecordExist: allRecordsExist,
        text
    }
}