import { prisma } from "@postgresql/prisma";

export const checkNeedEdit = async (group: string, date: string, lessonValue: any[]) => {
	let needEdit = false;

	for (const count in lessonValue) {
		if (lessonValue[count].length === 1) {
			if (lessonValue[count][0].length === 3) {
				const existLesson = await prisma.lessons.findFirst({
					where: {
						group,
						count: Number(count),
						status: Number(lessonValue[count][0][1]) === 1 ? "SubGroup1" : "SubGroup2",
						room: String(lessonValue[count][0][2]),
						descipline: lessonValue[count][0][0],
						date
					},
				});

				if (!existLesson) {
					console.log(1)
					needEdit = true;
				}
			}
		}

		if (lessonValue[count].length === 1) {
			if (lessonValue[count][0].length === 2) {
				console.log(lessonValue[count][0])
				const existLesson = await prisma.lessons.findFirst({
					where: {
						group,
						status: "JOINED",
						room: String(lessonValue[count][0][1]),
						descipline: lessonValue[count][0][0],
						count: Number(count),
						date
					},
				});
				console.log(existLesson);

				if (!existLesson) {
					console.log(2)
					needEdit = true;
				}
			}
		}

		if (lessonValue[count].length === 2) {
			const existLesson1 = await prisma.lessons.findFirst({
				where: {
					group,
					count: Number(count),
					descipline: lessonValue[count][0][0],
					room: String(lessonValue[count][0][2]),
					status: lessonValue[count][0][1] == 1 ? "SubGroup1" : "SubGroup2",
					date
				},
			});

			const existLesson2 = await prisma.lessons.findFirst({
				where: {
					group,
					count: Number(count),
					descipline: lessonValue[count][1][0],
					room: String(lessonValue[count][1][2]),
					status: lessonValue[count][1][1] == 1 ? "SubGroup1" : "SubGroup2",
					date
				},
			});

			if (!existLesson1 || !existLesson2) {
				console.log(3)
				needEdit = true;
			}
		}
	}

	return {
		needEdit,
	}
}
