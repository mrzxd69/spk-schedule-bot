import { register } from "@postgresql/abstractions/register";
import { getDate } from "@shared/utils/time";
import { selectTeacher } from "@keyboards/data/selects";
import { type TBot } from "@bot/index";
import { bold, format } from "gramio";
import { selectLessonsTeacher } from "@src/database/postgresql/abstractions/select";
import { scheduleStartTeacher } from "@bot/keyboards/buttons/start";

export default (bot: TBot) =>
	bot.callbackQuery(selectTeacher, async (ctx) => {
		await register(ctx.from.id, null, null, ctx.queryData.initials);

		await ctx.editText(format`🎉 ${bold("Отлично!")}\nТеперь Вам будут приходить персональные расписания.`);

		const lessons = await selectLessonsTeacher(ctx.queryData.initials, false);
		let text = lessons.map((lesson) => `<b>• ${lesson.count} пара:</b>\n Группа: ${lesson.group}\n Кабинет: ${lesson.room}\n\n`).join("");

		return ctx.send("🎉 Дата: " + getDate(false) + ":" + "\n\n" + text + "\n⚠️ Учитывайте риск ошибки бота при сборе расписания с канала!", {
			reply_markup: scheduleStartTeacher(ctx.queryData.initials.split(" ")[0], false),
			parse_mode: "HTML",
		});
	});
