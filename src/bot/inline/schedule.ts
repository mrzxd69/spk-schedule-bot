import { InlineKeyboard, InlineQueryResult, InputMessageContent } from "gramio"
import { botService } from ".."
import { prisma } from "@src/database/postgresql/prisma"
import { format } from "@formkit/tempo"
import { replaceRoom } from "@src/shared/utils/schedule"



export const sendMySchedule = () => {
    botService.inlineQuery(/send/i, async ctx => {
        const user = await prisma.users.findFirst({
            where: {
                telegram_id: ctx.senderId
            },
        });

        if (!user || !user.group) return ctx.answer([
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

        if (!group) return ctx.answer([
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

        if (lessonsCurrentDay.length === 0) {
            return ctx.answer([
                InlineQueryResult.article(
                    "id=1",
                    "На сегодня расписания нет",
                    InputMessageContent.text("Расписания нет.")
                ),
                InlineQueryResult.article(
                    "id=2",
                    lessonsTomorrow.length > 0 ? "Расписание на завтра" : "Расписание на завтра нет",
                    InputMessageContent.text("Расписания нет.")
                )
            ], {
                cache_time: 0,
            });
        }


        let textCurrentDay = lessonsCurrentDay
            .map(lesson => replaceRoom('', lesson))
            .join('');

        let textTomorrow = lessonsTomorrow
            .map(lesson => replaceRoom('', lesson))
            .join('');

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