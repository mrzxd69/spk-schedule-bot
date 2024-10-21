import path from "path";
import { Bot } from "gramio";
import { prompt } from "@gramio/prompt";
import { autoload } from "@gramio/autoload";
import { autoRetry } from "@gramio/auto-retry";

export const botService = new Bot(process.env.TELEGRAM_BOT_TOKEN)
	.extend(autoRetry())
	.onError("message", async ({ context, error }) => {
		if (error instanceof Error) {
			return context.send(error.message);
		}
		console.log(error);
		return context.send("Произошла неизвестная ошибка");
	})
	.extend(prompt())
	.extend(
		await autoload({
			failGlob: true,
			path: path.resolve("./src/bot/commands"),
		}),
	);

export type TBot = typeof botService;
