import { readFile, utils } from "xlsx";

interface IGetLinks {
    getLinks(search: string): { filesPath: Array<string>, filesName: Array<string> };
}

export class GetData {
    constructor(private count: number) { }

    public getData(search: string, getLinks: IGetLinks): Array<any> {
        const links = getLinks.getLinks(search);

        try {
            if (this.count < 0 || this.count >= links.filesPath.length) {
                throw new Error(`Индекс вне диапазона. Доступные индексы: 0 - ${links.filesPath.length - 1}`);
            }

            const workbook = readFile(links.filesPath[this.count]);
            const data = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

            return data

        } catch (error) {
            throw new Error("Не удалось получить данные из файла: " + links.filesPath[this.count]);
        }
    }
}
