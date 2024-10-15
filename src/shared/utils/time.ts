import { format as formatTime } from "@formkit/tempo";

export const getDate = (tomorrow: boolean) => {
	const date = new Date();

	if (tomorrow) date.setDate(date.getDate() + 1);

	return formatTime({
		date,
		format: "full",
		tz: "Asia/Omsk",
		locale: "ru",
	}).split(" 2024")[0];
};
