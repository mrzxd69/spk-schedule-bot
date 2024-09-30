import { FileManager } from "./internal/FileManager";
import { Main } from "./main";

export class Parser {
    private count: number = 0;
    private result: object = {};
    private file: FileManager;

    constructor(
        private search: "у" | "каб",
        private date: string
    ) {
        this.file = new FileManager(this.result, search, this.count)
    }

    private async isGroup(search: "у" | "каб", date: string) {
        const mainInstance = new Main(this.count);

        if (search === "у") {
            return mainInstance.saveSchedule(search, this.date).saveGroup();
        }

        return mainInstance.saveSchedule(search, this.date).saveTeacher();
    }

    public async start() {
        const length = this.file.getLength()

        for (this.count = 0; this.count < length; this.count++) {
            try {
                await this.isGroup(this.search, this.date)
            } catch (err) {
                console.error(`Ошибка при обработке count ${this.count}:`, err);
            }
        }
    }

    public pathOutput() {
        const pathOutput: string[] = this.file.getLinksMain(this.search)
            .filesOutput
            .map((path: string) => path
                .substring(path.indexOf("/output"))
                .replace("xlsx", "json")
            );


        return pathOutput;
    }
}