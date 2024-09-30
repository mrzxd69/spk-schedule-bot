import { CallbackData } from "gramio";

export const settings = new CallbackData("settings");

export const notificationNews = new CallbackData("notificationNews")
    .boolean("news");


export const notificationSchedule = new CallbackData("notificationSchedule")
    .boolean("schedule");