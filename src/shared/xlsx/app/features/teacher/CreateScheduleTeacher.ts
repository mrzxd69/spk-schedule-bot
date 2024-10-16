export class CreateScheduleTeacher {
	private result: object = {};

	constructor(private data: Array<any>) { }

	private remove(item: any): any {
		for (const index in item) {
			if (item[index].trim() === "") {
				delete item[index];
			}
		}
		return item;
	}

	public CreateScheduleTeacher(empty: object): object {
		for (let index in this.data) {
			const item = this.data[index];
			const clean = this.remove(item);

			for (let key in clean) {
				const value = clean[key];
				const name = value.split("  ")[0];

				if (key !== "__EMPTY" && !name.match(/\d+/g)) {
					//@ts-ignore
					if (!this.result[name]) { this.result[name] = [] }

					const roomInfo = [
						//@ts-ignore
						empty[key],
						value.split("  ")[1] === undefined ? "Пусто" : value.split("  ")[1]
					];

					// Добавляем название кабинета в конец массива
					roomInfo.push(clean.__EMPTY); // Добавляем название кабинета

					//@ts-ignore
					this.result[name].push(roomInfo);
				}
			}
		}

		return this.result;
	}
}
