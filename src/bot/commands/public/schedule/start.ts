import type { TBot } from "@bot/index";
import { scheduleStart } from "@bot/keyboards/buttons/start";
import { scheduleStart as scheduleStartData } from "@bot/keyboards/data/schedule";
import { selectLessons } from '@postgresql/abstractions/select';
import { replaceRoom } from "@src/shared/utils/schedule";

export default (bot: TBot) => {
    bot.callbackQuery(scheduleStartData, async ctx => {
        const { group, tomorrow } = ctx.queryData;

        const lessons = await selectLessons(group, tomorrow);

        let text = '';

        for(const lesson of lessons) {
            text = replaceRoom(text, lesson);
        }

        const isTomorrow = tomorrow ? 'завтра' : 'сегодня';
        const isEmptyText = text.includes("Пара") ? text : "Расписания нет\n\n";

        await ctx.editText(`🎉 Группа: <b>${group}</b>\n🗓 Расписание на ${isTomorrow}:\n\n${isEmptyText}⚠️ Учитывайте риск ошибки бота при сборе расписания с канала!`, {
            parse_mode: "HTML",
        });

        await ctx.editReplyMarkup(scheduleStart(group, tomorrow));
    })
}