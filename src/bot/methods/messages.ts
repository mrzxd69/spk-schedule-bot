import { TelegramError } from "gramio";
import { botService } from "..";
import { scheduler } from "timers/promises";

export const deleteMessage = async (chatId: number, messageId: number) => {
	return botService.api.deleteMessage({
		chat_id: chatId,
		message_id: messageId,
	});
};

export const sendMessage = async (chatId: string, message: string) => {
	try {
		const result = botService.api.sendMessage({
			chat_id: chatId,
			text: message,
			parse_mode: "HTML",
		}).catch(e => console.log(e));

		await scheduler.wait(
			//@ts-ignore
			result instanceof TelegramError && result.params?.retry_after
				//@ts-ignore
				? result.params.retry_after * 1000
				: 1000
		)

	} catch (e) {
		console.log("ERROR TO SENDS SCHEDULE:", e);
	}
};
