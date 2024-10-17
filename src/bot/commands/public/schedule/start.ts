import type { TBot } from "@bot/index";
import { scheduleStartGroup, scheduleStartTeacher } from "@bot/keyboards/buttons/start";
import { scheduleStartGroupData, scheduleStartTeacherData } from "@bot/keyboards/data/schedule";
import { selectLessons, selectLessonsTeacher } from "@postgresql/abstractions/select";
import { prisma } from "@src/database/postgresql/prisma";
import { getScheduleText } from "@src/shared/utils/schedule";
import { getDate } from "@src/shared/utils/time";

export default (bot: TBot) => {
    bot.callbackQuery(scheduleStartGroupData, async (ctx) => {
        const { group, tomorrow } = ctx.queryData;

        const lessons = await selectLessons(group, tomorrow);

        let text = await getScheduleText("", lessons, group, getDate(false));

        const isEmptyText = text.includes("b") ? "\n" + text : "\n\nРасписания нет\n";

        await ctx.editText(`🎉 Группа: <b>${group}</b>\n🗓 Дата: ${getDate(tomorrow ? true : false)}:${isEmptyText}\n⚠️ Учитывайте риск ошибки бота при сборе расписания с канала!`, {
            parse_mode: "HTML",
        });

        await ctx.editReplyMarkup(scheduleStartGroup(group, tomorrow));
    });

    bot.callbackQuery(scheduleStartTeacherData, async (ctx) => {
        const { teacher, tomorrow } = ctx.queryData;

        const lessons = await selectLessonsTeacher(teacher, tomorrow);

        let text = lessons
            .map((lesson) => `<b>• ${lesson.count} пара:</b>\n Группа: ${lesson.group}\n Кабинет: ${lesson.room}\n\n`)
            .join("");

        const registeredTeacher = await prisma.teachers.findFirst({
            where: {
                initials: {
                    startsWith: teacher
                },
            }
        })

        const isEmptyText = text.includes("пара") ? "\n\n" + text : "\n\nРасписания нет\n";

        await ctx.editText(`⭐️ <b>${registeredTeacher?.initials}</b>\nДата: ${getDate(tomorrow ? true : false)}:${isEmptyText}\n⚠️ Учитывайте риск ошибки бота при сборе расписания с канала!`, {
            parse_mode: "HTML",
            reply_markup: scheduleStartTeacher(teacher, tomorrow),
        });
    });
};
