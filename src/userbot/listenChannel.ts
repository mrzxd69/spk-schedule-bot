import path from "path";
import fs from "fs/promises";
import { Document } from "@mtcute/bun";
import { Dispatcher } from "@mtcute/dispatcher";
import { allowChannelsList } from "@src/constants";
import { userService } from "@src/userbot";
import { DebounceMessage } from "@userbot/debounce";
import { Parser } from "@src/shared/xlsx";
import { sendPhoto } from "@src/shared/newsletter/sendPhoto";

const downloadFiles = async (media: Document) => {
	if (await fs.exists(path.resolve("/data", media.fileName!))) {
		await fs.rm(path.resolve("/data", media.fileName!));
	}

	await userService.downloadToFile(path.resolve() + "/data/" + media.fileName!, media);
}


export const listenChannel = async () => {
	const dp = Dispatcher.for(userService);
	const debouncer = new DebounceMessage();

	dp.onNewMessage(async ({ chat, media }) => {
		console.log(chat.id)
		if (allowChannelsList.includes(chat.id) && media?.type === "document" && (await checkDocument(media.fileName!))) {
			try {
				await fs.rmdir(path.resolve() + "/data", { recursive: true }).catch(() => console.log("Данной директории не существует"));
				await fs.mkdir(path.resolve() + "/data", { recursive: true }).catch(() => console.log("Ошибка при создании директории"));

				await downloadFiles(media);

				const date = media.fileName!.match(/\d{2}\.\d{2}/);

				debouncer.debounce(() => parseSchedules(String(date) || "не указано"), 3000);
			} catch (e) {
				console.log("Ошибка при обработке данных: " + e);
			}
		}

		if (allowChannelsList.includes(chat.id) && media?.type === "document" && media?.fileName?.startsWith("Расписание на")) {
			try {
				await fs.rmdir(path.resolve() + "/data", { recursive: true }).catch(() => console.log("Данной директории не существует"));
				await fs.mkdir(path.resolve() + "/data", { recursive: true }).catch(() => console.log("Ошибка при создании директории"));

				await downloadFiles(media);

				sendPhoto(media.fileName!);
			} catch (e) {
				console.log(e);
			}
		}
	});
};

const parseSchedules = async (date: string) => {
	const students = new Parser("у", date);
	const teachers = new Parser("каб", date);

	await students.start();
	await teachers.start();
};

const checkDocument = async (documentName: string) => {
	const regex = new RegExp(/(учен|кабин|зам)/i);
	return documentName ? regex.test(documentName) : false;
};
