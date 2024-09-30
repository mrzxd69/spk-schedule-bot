import { CallbackData } from "gramio";

export const scheduleStart = new CallbackData('scheduleStart')
    .boolean("tomorrow")
    .string("group");