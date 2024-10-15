import { prisma } from "@postgresql/prisma";
import { InlineKeyboard } from "gramio";
import { notificationNews, notificationSchedule } from "../data/menu";

export const settingsKeyboard = async (id: number) => {
	const user = await prisma.users.findFirst({
		where: {
			telegram_id: id,
		},
		include: {
			setting: true,
		},
	});

	if (!user?.setting) throw Error("Ошибка на стороне сервиса");

	return new InlineKeyboard()
		.text(
			`${user.setting.notification_news ? `🔕 Выключить` : `🔔 Включить`} уведомления о новостях`,
			notificationNews.pack({
				news: !user.setting.notification_news,
			}),
		)
		.row()
		.text(
			`${user.setting.notification_schedule ? `🔕 Выключить` : `🔔 Включить`} уведомления о расписании`,
			notificationSchedule.pack({
				schedule: !user.setting.notification_schedule,
			}),
		);
};
