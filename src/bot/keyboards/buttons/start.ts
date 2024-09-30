import { InlineKeyboard } from "gramio"
import { scheduleStart as scheduleStartData } from "@keyboards/data/schedule"

export const scheduleStart = (group: string, tomorrow: boolean) => {
    return new InlineKeyboard()
        .text(`Расписание на ${tomorrow ? 'сегодня' : 'завтра'}`, scheduleStartData.pack({
            tomorrow: !tomorrow,
            group
        }));
}