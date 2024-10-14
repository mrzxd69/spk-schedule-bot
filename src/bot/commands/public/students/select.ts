import { register } from '@postgresql/abstractions/register';
import { getChooseCourseKeyboard } from '@keyboards/buttons/selects';
import {
	selectCourse,
	selectRoute
} from "@keyboards/data/selects";
import type { TBot } from '@bot/index';
import { selectLessons } from '@postgresql/abstractions/select';
import { scheduleStartGroup } from '@bot/keyboards/buttons/start';
import { getScheduleText } from '@shared/utils/schedule';

export default (bot: TBot) =>
	bot
		// Выбор группы
		.callbackQuery(selectRoute, async (ctx) => {
			const party = ctx.queryData.route;

			const keyboard = await getChooseCourseKeyboard(party);

			await ctx.editText('Теперь выберите Ваш курс группы:');
			return ctx.editReplyMarkup(keyboard);
		})

		// Выбор курса
		.callbackQuery(selectCourse, async (ctx) => {

			const { course, route } = ctx.queryData;

			const registerId = (ctx.message?.chat.id && ctx.message?.chat.id < 1)
				? ctx.message?.chat.id
				: ctx.from.id;

			await register(
				registerId,
				route,
				course,
				null
			);

			const lessons = await selectLessons(String(route + course), false);

			let text = await getScheduleText('', lessons);
			const isEmptyText = text.includes("b") ? text : "\n\nРасписания нет\n";

			await ctx.editText(`🎉 Ваша группа: ${route + course}\n🗓 Расписание на сегодня:\n${isEmptyText}\n⚠️ Учитывайте риск ошибки бота при сборе расписания с канала!`, {
				parse_mode: "HTML",
				reply_markup: scheduleStartGroup(String(route + course), false)
			});
		});