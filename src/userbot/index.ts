import { TelegramClient } from "@mtcute/bun";

const userService = new TelegramClient({
	apiId: Number(process.env.APP_ID),
	apiHash: process.env.APP_HASH,
});

await userService.start({
	phone: () => userService.input("Phone > "),
	code: () => userService.input("code > "),
	password: () => userService.input("password > "),
});

export { userService };
