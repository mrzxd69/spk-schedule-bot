import { CallbackData } from "gramio";

export const isStudentData = new CallbackData('isStudentData').boolean(
	'isStudent',
);

export const selectTeacher = new CallbackData('teacher').string('initials');

export const selectCourse = new CallbackData('selectCourse')
	.string('course')
	.string('route');

export const selectRoute = new CallbackData('selectRoute').string('route');

export const pagination = new CallbackData('pagination')
	.number('offset')

export const exitStartData = new CallbackData('start');