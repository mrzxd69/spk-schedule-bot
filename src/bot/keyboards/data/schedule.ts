import { CallbackData } from "gramio";

export const scheduleStartGroupData = new CallbackData("scheduleStartGroup").boolean("tomorrow").string("group");

export const scheduleStartTeacherData = new CallbackData("scheduleStartTeacher").boolean("tomorrow").string("teacher");
