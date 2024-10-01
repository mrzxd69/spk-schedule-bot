import { InlineKeyboard } from "gramio"
import {
    scheduleStartGroupData,
    scheduleStartTeacherData
} from "@keyboards/data/schedule"

export const scheduleStartGroup = (group: string, tomorrow: boolean) => {
    return new InlineKeyboard()
        .text(`Расписание на ${tomorrow ? 'сегодня' : 'завтра'}`, scheduleStartGroupData.pack({
            tomorrow: !tomorrow,
            group
        }));
}

export const scheduleStartTeacher = (teacher: string, tomorrow: boolean) => {

    return new InlineKeyboard()
        .text(`Расписание на ${tomorrow ? 'сегодня' : 'завтра'}`, scheduleStartTeacherData.pack({
            tomorrow: !tomorrow,
            teacher
        }));
}