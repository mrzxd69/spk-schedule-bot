
import { register } from '@postgresql/abstractions/register';

import {
    selectTeacher
} from "@keyboards/data/selects";
import type { TBot } from '@bot/index';
import { bold, format } from 'gramio';

export default (bot: TBot) =>
	bot
		.callbackQuery(selectTeacher, async (ctx) => {
            await register(ctx.from.id, null, null, ctx.queryData.initials);

            await ctx.editText(format`🎉 ${bold("Отлично!")}\nТеперь Вам будут приходить персональные расписания.`);
        });