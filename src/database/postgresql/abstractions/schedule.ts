import { prisma } from "@postgresql/prisma"
import type { ICheckLessonExist } from "@src/shared/types/schedule";

export const addTeachers = async (initials: string[]) => {
	const existsTeachers = await prisma.teachers.findMany({
		select: {
			initials: true
		},
		where: {
			initials: {
				in: initials
			}
		}
	});

	const existingNamesSet = new Set(existsTeachers.map(({ initials }) => initials));

	const newNames = initials.filter(initials => !existingNamesSet.has(initials));

	if (newNames) {
		await prisma.teachers.createMany({
			data: newNames.map(initials => ({
				initials
			})),
			skipDuplicates: true
		});
	}
}


export const addGroup = async (groups: { route: string, course: string }[]) => {
	try {
		const cleanedGroups = groups.map(group => ({
			route: group.route.replace(/\s+/g, ''),
			course: group.course.replace(/\s+/g, '')
		}));

		const existingGroups = await prisma.groups.findMany({
			select: {
				route: true,
				course: true
			}
		});

		const existingGroupsSet = new Set(existingGroups.map(group => JSON.stringify(group)));

		const newGroups = cleanedGroups.filter(group => {
			const groupKey = JSON.stringify(group);
			return !existingGroupsSet.has(groupKey);
		});

		if (newGroups.length > 0) {
			await prisma.groups.createMany({
				data: newGroups,
			});
		}
	} catch (e) {
		console.log(e);
	}
}


export const existLessons = async (data: ICheckLessonExist) => {
	return prisma.lessons.findFirst({
		where: data
	});
}