import { SaveManager } from "./app/main/SaveManager";

export class Main {
	private count = 0;

	constructor(count: number) {
		this.count = count;
	}

	public saveSchedule(search: string, date: string, searchEdit: string, countEdit: number) {
		const saveGroup = async () => {
			await new SaveManager(this.count, countEdit).saveGroup(search, date);
		};

		const saveTeacher = async () => {
			await new SaveManager(this.count, countEdit).saveTeacher(search, date, searchEdit);
		};

		return { saveGroup, saveTeacher };
	}
}
