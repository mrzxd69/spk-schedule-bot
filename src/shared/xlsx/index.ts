import { FileManager } from "./internal/FileManager";
import { Main } from "./main";

export class Parser {
	private count: number = 0;
	private countEdit: number = 0;
	private file: FileManager;

	constructor(
		private search: "у" | "каб" | "зам",
		private date: string,
	) {
		this.file = new FileManager(search, this.count);
	}

	private async isGroup(search: "у" | "каб" | "зам") {
		const mainInstance = new Main(this.count);

		if (search === "у") {
			return mainInstance.saveSchedule(search, this.date, "зам", this.countEdit).saveGroup();
		}

		if (search === "каб") {
			return mainInstance.saveSchedule(search, this.date, "зам", this.countEdit).saveTeacher();
		}
	}

	public async start() {
		const length = this.file.getLength();

		for (this.count = 0; this.count < length; this.count++) {
			try {
				await this.isGroup(this.search);
			} catch (err) {
				console.error(`Ошибка при обработке count ${this.count}:`, err);
			}
		}
	}

	public pathOutput() {
		const pathOutput: string[] = this.file.getLinksMain(this.search).filesOutput.map((path: string) => path.substring(path.indexOf("/output")).replace("xlsx", "json"));

		return pathOutput;
	}
}
