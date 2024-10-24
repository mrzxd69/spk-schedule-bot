import { TelegramError } from "gramio";
import { botService } from "@src/bot";
import { scheduler } from "timers/promises";

export const deleteMessage = async (chatId: number, messageId: number) => {
	return botService.api.deleteMessage({
		chat_id: chatId,
		message_id: messageId,
	});
};

export const sendMessage = async (chatId: string, message: string) => {
	try {
		const result = await botService.api.sendMessage({
			suppress: true,
			chat_id: chatId,
			text: message,
			parse_mode: "HTML",
		});

		await scheduler.wait(
			// @ts-ignore
			result instanceof TelegramError && result.params?.retry_after
				// @ts-ignore
				? result.params.retry_after * 250
				: 80
		);

	} catch (e) {
		console.log("Error to send schedule:", e);
	}
};
