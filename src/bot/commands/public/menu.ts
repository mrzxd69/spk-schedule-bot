import type { TBot } from "@bot/index";
import { settingsKeyboard } from "@bot/keyboards";

export default (bot: TBot) => {
	bot.command("settings", async (ctx) => {
		try {
			const keyboard = settingsKeyboard(ctx.from?.id!);

			await ctx.send("Вы в меню настроек\n\nВыберите что хотели бы изменить:", {
				reply_markup: await keyboard,
			});
		} catch (e) {
			console.log(e);
			await ctx.send("На стороне сервиса произошла ошибка");
		}
	});
};
