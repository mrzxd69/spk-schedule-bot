import { register } from '@postgresql/abstractions/register';
import { getChooseCourseKeyboard } from '@keyboards/buttons/selects';
import {
	selectCourse,
	selectRoute
} from "@keyboards/data/selects";
import type { TBot } from '@bot/index';
import { selectLessons } from '@postgresql/abstractions/select';
import { scheduleStart } from '@bot/keyboards/buttons/start';
import { replaceRoom } from '@src/shared/utils/schedule';

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

			await register(ctx.from.id, route, course, null);

			const lessons = await selectLessons(String(route + course), false);

			let text = '';

			for (const lesson of lessons) {
				text = replaceRoom(text, lesson);
			}

			const isEmptyText = text.includes("Пара") ? text : "Расписания нет\n\n";

			await ctx.send(`🎉 Ваша группа: ${route + course}\n🗓 Расписание на сегодня:\n\n${isEmptyText}⚠️ Учитывайте риск ошибки бота при сборе расписания с канала!`, {
				parse_mode: "HTML",
				reply_markup: scheduleStart(String(route + course), false)
			})
		});