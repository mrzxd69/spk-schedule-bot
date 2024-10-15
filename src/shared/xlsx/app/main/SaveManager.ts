import { addGroup, addTeachers } from "@postgresql/abstractions/schedule";
import { addLessonsStudents, addLessonsTeachers } from "@shared/newsletter/processing/generation";
import { FileManager } from "../../internal/FileManager";
import { CreateManager } from "./CreateManager";
import { FilterManager } from "./FilterManager";

export class SaveManager {
	private result = [];
	private count;
	private counter = 0;

	constructor(count: number) {
		this.count = count;
	}

	public async saveGroup(search: string, date: string) {
		const data = new FileManager(search, this.count).getDataMain();
		try {
			while (this.counter < data.length) {
				try {
					const create = new CreateManager(data, this.counter);
					const filter = new FilterManager();
					//@ts-ignore
					this.result.push(filter.transformedGroup(create.createScheduleGroup()));
					this.counter++; // Увеличиваем счетчик
				} catch (error) {
					await addGroup(this.groupConvert(this.result));
					await addLessonsStudents(this.result, date);
					break;
				}
			}
		} catch (error) {
			console.error("Произошла ошибка:", error);
		}
	}

	public async saveTeacher(search: string, date: string) {
		const data = new FileManager(search, this.count).getDataMain();
		try {
			const create = new CreateManager(data, this.counter);
			const filter = new FilterManager();
			//@ts-ignore
			this.result = filter.TransformedDataTeacher(create.createScheduleTeacher());

			const teachers = [];
			for (const teacher in this.result) {
				teachers.push(teacher);
			}

			// @ts-ignore
			await addTeachers(teachers);
			await addLessonsTeachers(this.result, date);
		} catch (error) {
			console.error("Произошла ошибка:", error);
		}
	}

	public groupConvert(result: any) {
		const res: { route: string; course: string }[] = [];

		for (const section of result) {
			for (const group of Object.keys(section)) {
				if (group.length < 13) {
					const match = group.match(/^([А-Яа-яA-Za-z]+)(\d+.*)$/);
					if (match && match[1] && match[2]) {
						res.push({
							route: match[1],
							course: match[2],
						});
					}
				}
			}
		}

		return res;
	}
}
