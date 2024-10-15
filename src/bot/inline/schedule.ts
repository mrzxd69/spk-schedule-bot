import { botService } from "..";
import { prisma } from "@src/database/postgresql/prisma";
import { studentInlineService, teachersInlineService } from "./services";

export const sendMySchedule = () => {
	botService.inlineQuery(/send/i, async (ctx) => {
		const user = await prisma.users.findFirst({
			where: {
				telegram_id: ctx.senderId,
			},
		});

		if (user?.group) {
			return studentInlineService(ctx, user);
		}
		return teachersInlineService(ctx, user);
	});
};
