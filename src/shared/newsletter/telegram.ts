import { sendMessage } from "@bot/methods/messages";
import { prisma } from "@postgresql/prisma";

export const sendGroupSchedule = async (group: string, text: string) => {
	const match = group.match(/^([А-Яа-яA-Za-z]+)(\d+.*)$/);
	if (!match || !match[1] || !match[2]) return;

	const existGroup = await prisma.groups.findFirst({
		where: {
			route: match[1],
			course: match[2].replace(/\s+/g, ""),
		},
	});

	if (!existGroup) return;

	const users = await prisma.users.findMany({
		where: {
			AND: [
				{ group: existGroup.id },
				{
					setting: {
						notification_schedule: {
							equals: true,
						},
					},
				},
			],
		},
	});

	if (group.includes("библиотечный день")) {
		text += "\n\n🥳" + group;
	}

	users.map(async (user) => await sendMessage(String(user.telegram_id), text));
};

export const sendTeachersSchedule = async (users: any[], text: string) => {
	users.map(async (user) => await sendMessage(String(user.telegram_id), text));
};
