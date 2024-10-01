import type { TBot } from "@bot/index";
import { scheduleStartGroup, scheduleStartTeacher } from "@bot/keyboards/buttons/start";
import { scheduleStartGroupData, scheduleStartTeacherData } from "@bot/keyboards/data/schedule";
import { selectLessons, selectLessonsTeacher } from '@postgresql/abstractions/select';
import { replaceRoom } from "@src/shared/utils/schedule";

export default (bot: TBot) => {
    bot.callbackQuery(scheduleStartGroupData, async ctx => {
        const { group, tomorrow } = ctx.queryData;

        const lessons = await selectLessons(group, tomorrow);

        let text = lessons
            .map(lesson => replaceRoom('', lesson))
            .join('');

        const isTomorrow = tomorrow ? 'завтра' : 'сегодня';
        const isEmptyText = text.includes("Пара") ? text : "Расписания нет\n\n";

        await ctx.editText(
            `🎉 Группа: <b>${group}</b>\n🗓 Расписание на ${isTomorrow}:\n\n${isEmptyText}⚠️ Учитывайте риск ошибки бота при сборе расписания с канала!`,
            {
                parse_mode: "HTML",
            }
        );

        await ctx.editReplyMarkup(scheduleStartGroup(group, tomorrow));
    })

    bot.callbackQuery(scheduleStartTeacherData, async ctx => {
        const { teacher, tomorrow } = ctx.queryData;

        const lessons = await selectLessonsTeacher(teacher, tomorrow);

        let text = lessons.map(lesson => `• ${lesson.count} пара:\n Группа: ${lesson.group}\n Кабинет: ${lesson.room}\n\n`).join('');

        const isTomorrow = tomorrow ? 'завтра' : 'сегодня';
        const isEmptyText = text.includes("пара") ? text : "Расписания нет\n\n";

        await ctx.editText(
            `🎉 Расписание на <b>${isTomorrow}</b>:\n\n${isEmptyText}⚠️ Учитывайте риск ошибки бота при сборе расписания с канала!`,
            {
                parse_mode: "HTML",
                reply_markup: scheduleStartTeacher(teacher, tomorrow)
            }
        );
    })
}