import { format, bold, italic,  } from 'gramio';

import type { TBot } from "@src/bot";
import { isStudentKeyboard, isStudentData, getChooseRouteKeyboard, pagination, searchTeacherKeyboard } from '@bot/keyboards';
import { deleteMessage } from '@bot/methods/messages';


export default (bot: TBot) => {
    bot.command("start", async ctx => {
        await ctx.send(format`${bold('Добро пожаловать!')}\n\nЭтот бот поможет вам легче взаимодействовать с расписанием 📚`);
        return ctx.send('Пожалуйста, выберите кем являетесь:', {
            reply_markup: isStudentKeyboard(),
        });
    });

    
    bot.callbackQuery(isStudentData, async ctx => {
        const { isStudent } = ctx.queryData;

        if (!isStudent) {
            if (ctx.message?.chat.type === "group") {
                return ctx.answerCallbackQuery({
                    text: "Преподаватели в группах не поддерживаются. Это не имеет смысла.",
                });
            }

            const initials = await ctx.prompt(
                format`Введите ваши инициалы:\n\n(${italic("Пример:")} ${bold("Иванов И.И.")} или ${bold("Иванов")})`
            );

            if (initials) {
                // @ts-ignore
                const keyboard = await searchTeacherKeyboard(initials.text);

                if (!keyboard) {
                    return ctx.send("Ничего не найдено. Попробуйте еще раз.", {
                        reply_markup: isStudentKeyboard(),
                    });
                }

                return ctx.send("Выберите свои инициалы из списка:", {
                    reply_markup: keyboard,
                });
            }
        } else {
            await ctx.editText('Отлично! Найдите свою группу в списке:');
            return ctx.editReplyMarkup(await getChooseRouteKeyboard());
        }
    });

    bot.callbackQuery(pagination, async ctx => {
        const { offset } = ctx.queryData;
        const keyboard = await getChooseRouteKeyboard(offset);

        return ctx.editReplyMarkup(keyboard);
    });
};