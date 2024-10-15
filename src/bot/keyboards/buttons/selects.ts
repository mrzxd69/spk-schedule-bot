import { InlineKeyboard } from "gramio";
import { exitStartData, isStudentData, pagination, selectCourse, selectRoute, selectTeacher } from "@keyboards/data/selects";
import { prisma } from "@postgresql/prisma";

const OFFSET_GROUP = 8;

export const isStudentKeyboard = () => {
	return new InlineKeyboard().text("📙 Я студент", isStudentData.pack({ isStudent: true })).text("📚 Я преподаватель", isStudentData.pack({ isStudent: false }));
};

export const getChooseRouteKeyboard = async (offset: number = 0): Promise<InlineKeyboard> => {
	let buttonCountRow = 0;
	let totalTeachers = await prisma.groups.findMany({
		distinct: ["route"],
	});

	const groups = await prisma.groups.findMany({
		skip: offset,
		take: OFFSET_GROUP,
		distinct: ["route"],
	});

	if (groups.length === 0) {
		return getChooseRouteKeyboard(0);
	}

	const keyboard = new InlineKeyboard();

	for (const group of groups) {
		if (buttonCountRow % 2 === 0) {
			keyboard.row();
		}
		keyboard.text(group.route, selectRoute.pack({ route: group.route }));

		buttonCountRow++;
	}

	const totalPages = Math.ceil(totalTeachers.length / OFFSET_GROUP);
	const currentPage = Math.ceil((offset + 1) / OFFSET_GROUP);

	keyboard
		.row()
		.text(
			"«",
			pagination.pack({
				offset: offset >= OFFSET_GROUP ? offset - OFFSET_GROUP : offset,
			}),
		)
		.text(`${currentPage}/${totalPages}`, pagination.pack({ offset: 0 }))
		.text("»", pagination.pack({ offset: offset + OFFSET_GROUP }))
		.row()
		.text("Назад", exitStartData.pack({}));

	return keyboard;
};

export const searchTeacherKeyboard = async (initials: string): Promise<InlineKeyboard | null> => {
	const teachers = await prisma.teachers.findMany({
		where: {
			initials: {
				contains: initials,
				mode: "insensitive"
			}
		},
	});

	if (teachers.length === 0) return null;

	const keyboard = new InlineKeyboard();

	for (const teacher of teachers) {
		keyboard.row().text(
			teacher.initials,
			selectTeacher.pack({
				initials: teacher.initials,
			}),
		);
	}

	return keyboard.row().text("Назад", isStudentData.pack({ isStudent: false }));
};

export const getChooseCourseKeyboard = async (party: string) => {
	let numerations = await prisma.groups.findMany({
		where: {
			route: party,
		},
	});

	const keyboard = new InlineKeyboard();

	for (const numeration of numerations) {
		if (numeration.id % 2 === 1) {
			keyboard.row().text(
				numeration.course,
				selectCourse.pack({
					course: numeration.course,
					route: party,
				}),
			);
			continue;
		}

		keyboard.text(
			numeration.course,
			selectCourse.pack({
				course: numeration.course,
				route: party,
			}),
		);
	}

	return keyboard.row().text("Назад", isStudentData.pack({ isStudent: true }));
};
