import { botService } from "..";

export const deleteMessage = async (chatId: number, messageId: number) => {
	return botService.api.deleteMessage({
		chat_id: chatId,
		message_id: messageId,
	});
};

export const sendMessage = async (chatId: string, message: string) => {
	try {
		return botService.api.sendMessage({
			chat_id: chatId,
			text: message,
			parse_mode: "HTML",
		});
	} catch (e) {
		console.log("ERROR TO SENDS SCHEDULE:", e);
	}
};
