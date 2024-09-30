import { readdirSync } from "fs";
import path from "path";

export class GetLinks {
    constructor(
        private pathData: string,
        private pathOutput: string
    ) { }

    public getLinks(search: string): { filesPath: Array<string>, filesName: Array<string>, filesOutput: Array<string> } {
        try {
            const filesPath = readdirSync(this.pathData)
                .filter(fileName => fileName.includes(search))
                .map(fileName => path.join(this.pathData, fileName));

            const filesOutput = readdirSync(this.pathData)
                .filter(fileName => fileName.includes(search))
                .map(fileName => path.join(this.pathOutput, fileName));

            const filesName = readdirSync(this.pathData)
                .filter(fileName => fileName.includes(search))
                .map(fileName => fileName.replace(/\.xls[x]?$/, '.json'));

            return { filesPath, filesName, filesOutput };
        } catch (error) {
            throw new Error("Не удалось получить данные по пути: " + this.pathData);
        }
    }
}