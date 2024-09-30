import type { TBot } from "@bot/index";
import { notificationNews, notificationSchedule, settingsKeyboard } from "@bot/keyboards";
import { prisma } from "@src/database/postgresql/prisma";


export default (bot: TBot) => {
    bot.callbackQuery(notificationNews, async ctx => {
        const user = await prisma.users.findFirst({
            where: {
                telegram_id: ctx.from.id
            }
        })

        await prisma.users.update({
            data: {
                setting: {
                    update: {
                        data: {
                            notification_news: ctx.queryData.news
                        }
                    }
                }
            },
            where: {
                id: user?.id
            }
        });

        await ctx.editText("✅ Режим уведомлений изменён")
        return ctx.editReplyMarkup(await settingsKeyboard(ctx.from?.id!))
    })

    bot.callbackQuery(notificationSchedule, async ctx => {
        const user = await prisma.users.findFirst({
            where: {
                telegram_id: ctx.from.id
            }
        })

        await prisma.users.update({
            data: {
                setting: {
                    update: {
                        data: {
                            notification_schedule: ctx.queryData.schedule
                        }
                    }
                }
            },
            where: {
                id: user?.id
            }
        });

        await ctx.editText("✅ Режим уведомлений изменён")
        return ctx.editReplyMarkup(await settingsKeyboard(ctx.from?.id!))
    })
}
