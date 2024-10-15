import { prisma } from "@postgresql/prisma";

export const register = async (id: number, route: string | null, course: string | null, initials: string | null) => {
	const user = await prisma.users.findFirst({
		where: {
			telegram_id: id,
		},
	});

	const userData = {
		telegram_id: id,
		setting: {
			create: {
				notification_news: true,
				notification_schedule: true,
			},
		},
	};

	if (route && course) {
		const group = await prisma.groups.findFirst({
			where: {
				route,
				course,
			},
		});

		if (!group) {
			throw new Error("Данная группа не найдена");
		}

		if (user) {
			return prisma.users.update({
				data: {
					group: group.id,
					teacher: null,
				},
				where: {
					id: user.id,
				},
			});
		}

		return prisma.users.create({
			data: {
				...userData,
				group: group.id,
			},
		});
	}

	if (initials) {
		const teacher = await prisma.teachers.findFirst({
			where: {
				initials,
			},
		});

		if (!teacher) {
			throw new Error("Данный преподаватель не найден");
		}

		if (user) {
			return prisma.users.update({
				data: {
					teacher: teacher.id,
					group: null,
				},
				where: {
					id: user.id,
				},
			});
		}

		return prisma.users.create({
			data: {
				...userData,
				teacher: teacher.id,
			},
		});
	}

	throw new Error("Необходимо указать либо группу, либо преподавателя.");
};
