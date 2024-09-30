import { InlineKeyboard, InlineQueryResult, InputMessageContent } from "gramio"
import { botService } from ".."
import { prisma } from "@src/database/postgresql/prisma"
import { format } from "@formkit/tempo"



export const sendMySchedule = () => {
    botService.inlineQuery(/send/i, async ctx => {
        const user = await prisma.users.findFirst({
            where: {
                telegram_id: ctx.senderId
            },
        });

        if(!user || !user.group) return ctx.answer([
            InlineQueryResult.article(
                "id=1",
                "Авторизуйтесь в боте",
                InputMessageContent.text("Для получения расписания нужна авторизация в системе"),
                {
                    reply_markup: new InlineKeyboard().url("⭐️ Перейти в бота ⭐️", "https://t.me/iwurbot")
                }
            )
        ], {
            cache_time: 0,
        });

        const group = await prisma.groups.findFirst({
            where: {
                id: user.group
            }
        });

        if(!group) return ctx.answer([
            InlineQueryResult.article(
                "id=1",
                "Данной группы не существует",
                InputMessageContent.text("Данной группы не существует")
            )
        ], {
            cache_time: 0,
        });

        const date = new Date()

        const lessonsCurrentDay = await prisma.lessons.findMany({
            where: {
                group: String(group.route + group.course),
                date: format({
                    date: date,
                    format: "DD.MM",
                    tz: "Asia/Omsk"
                })
            },
            orderBy: {
                id: "asc"
            }
        });

        date.setDate(date.getDate() + 1);
        

        const lessonsTomorrow = await prisma.lessons.findMany({
            where: {
                group: String(group.route + group.course),
                date: format({
                    date: date,
                    format: "DD.MM",
                    tz: "Asia/Omsk"
                })
            },
            orderBy: {
                id: "asc"
            }
        });

        if(lessonsCurrentDay.length === 0) {
            return ctx.answer([
                InlineQueryResult.article(
                    "id=1",
                    "На сегодня расписания нет",
                    InputMessageContent.text("Пусто")
                ),
                InlineQueryResult.article(
                    "id=2",
                    lessonsTomorrow.length > 0 ? "Расписание на завтра" : "Расписание на завтра нет",
                    InputMessageContent.text("Пусто")
                )
            ], {
                cache_time: 0,
            });
        }


        let textCurrentDay = '';
        let textTomorrow = '';

        for(const lesson of lessonsCurrentDay) {
            const descipline = isNaN(Number(lesson.descipline)) ? lesson.descipline : lesson.room;
            const count = isNaN(Number(lesson.descipline)) ? lesson.count : lesson.descipline;
            const room = isNaN(Number(lesson.descipline)) ? lesson.room : "";

            if(lesson.status === "JOINED") textCurrentDay += `<b>Пара: ${count}</b>\n  Дисциплина: ${descipline}\n   Кабинет: ${room}\n\n`;
            if(lesson.status === "SubGroup1") textCurrentDay += `<b>Пара: ${count}</b>\n  Дисциплина: ${descipline}\n   Первая подгруппа: ${room}\n`;
            if(lesson.status === "SubGroup2") textCurrentDay += `   Вторая подгруппа: ${room}\n\n`;
        }

        for(const lesson of lessonsTomorrow) {
            // На случай если не указаны кабинеты
            const descipline = isNaN(Number(lesson.descipline)) ? lesson.descipline : lesson.room;
            const count = isNaN(Number(lesson.descipline)) ? lesson.count : lesson.descipline;
            const room = isNaN(Number(lesson.descipline)) ? lesson.room : "";

            if(lesson.status === "JOINED") textTomorrow += `<b>Пара: ${count}</b>\n  Дисциплина: ${descipline}\n   Кабинет: ${room}\n\n`;
            if(lesson.status === "SubGroup1") textTomorrow += `<b>Пара: ${count}</b>\n  Дисциплина: ${descipline}\n   Первая подгруппа: ${room}\n`;
            if(lesson.status === "SubGroup2") textTomorrow += `   Вторая подгруппа: ${room}\n\n`;
        }
        
        await ctx.answer([
            InlineQueryResult.article(
                "id=1",
                "Расписание на сегодня",
                InputMessageContent.text("⭐️ Моё расписание на <b>сегодня</b>:\n\n" + textCurrentDay, {
                    parse_mode: "HTML"
                    
                })
            ),
            InlineQueryResult.article(
                "id=2",
                "Расписание на завтра",
                InputMessageContent.text("⭐️ Моё расписание на <b>завтра</b>:\n\n" + textTomorrow, {
                    parse_mode: "HTML"
                    
                })
            )
        ], {
            cache_time: 0,
        });
    })
}