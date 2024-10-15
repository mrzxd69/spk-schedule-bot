import type { TBot } from "@bot/index";
import { exitStartData, isStudentKeyboard } from "@bot/keyboards";

export default (bot: TBot) => {
	bot.callbackQuery(exitStartData, (ctx) => {
		return ctx.editText("Пожалуйста, выберите кем являетесь:", {
			reply_markup: isStudentKeyboard(),
		});
	});
};
