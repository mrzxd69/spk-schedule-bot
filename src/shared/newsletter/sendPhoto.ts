import { botService } from "@bot/index";
import { prisma } from "@postgresql/prisma";
import { MediaUpload } from "gramio";
import path from "path"


export const sendPhoto = async (pathFile: string) => {
    const users = await prisma.users.findMany();

    for (const user of users) {
        try {
            await botService.api.sendPhoto({
                chat_id: String(user.telegram_id),
                photo: MediaUpload.path(path.resolve() + "/data/" + pathFile),
            });
        } catch (e) {
            console.log("ERROR TO SENDS PHOTOS:", e);
        }
    }
}