import { prisma } from "@postgresql/prisma";

export const checkNeedEdit = async (group: string, lesson: string, lessonValue: any[]) => {
	let needEdit = false;

	for (const lesson in lessonValue) {
		if (lessonValue[lesson].length === 1) {
			if (lessonValue[lesson][0].length === 3) {
				const existLesson = await prisma.lessons.findFirst({
					where: {
						AND: [
							{ group },
							{ count: Number(lesson) },
							{
								descipline: lessonValue[lesson][0][0],
							},
							{
								room: String(lessonValue[lesson][0][2]),
							},
							{
								status: Number(lessonValue[lesson][0][1]) === 1 ? "SubGroup1" : "SubGroup2",
							},
						],
					},
				});

				if (!existLesson) {
					needEdit = true;
				}
			}
		}

		if (lessonValue[lesson].length === 1) {
			if (lessonValue[lesson][0].length === 2) {
				const existLesson = await prisma.lessons.findFirst({
					where: {
						AND: [
							{ group },
							{ count: Number(lesson) },
							{
								descipline: lessonValue[lesson][0][0],
							},
							{
								room: String(lessonValue[lesson][0][1]),
							},
							{
								status: "JOINED",
							},
						],
					},
				});

				if (!existLesson) {
					needEdit = true;
				}
			}
		}

		if (lessonValue[lesson].length === 2) {
			const existLesson1 = await prisma.lessons.findFirst({
				where: {
					AND: [
						{ group },
						{ count: Number(lesson) },
						{
							descipline: lessonValue[lesson][0][0],
						},
						{
							room: String(lessonValue[lesson][0][2]),
						},
						{
							status: lessonValue[lesson][0][1] === 1 ? "SubGroup1" : "SubGroup2",
						},
					],
				},
			});

			const existLesson2 = await prisma.lessons.findFirst({
				where: {
					AND: [
						{ group },
						{ count: Number(lesson) },
						{
							descipline: lessonValue[lesson][1][0],
						},
						{
							room: String(lessonValue[lesson][1][2]),
						},
						{
							status: lessonValue[lesson][1][1] === 1 ? "SubGroup1" : "SubGroup2",
						},
					],
				},
			});

			if (!existLesson1 || !existLesson2) {
				needEdit = true;
			}
		}
	}

	return {
		needEdit,
	};
};
