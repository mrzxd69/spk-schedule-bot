export class CreateScheduleEdit {
    private result: any = {};

    constructor(private data: Array<any>) { }

    public CreateScheduleEdit(empty: object): object {
        for (const item in this.data) {
            if (this.data[item].__EMPTY) {
                this.data.forEach(item => {
                    const objectName = item.__EMPTY;
                    const groupedData = {};

                    for (const key in item) {
                        if (key !== "__EMPTY" && key !== "__rowNum__") {
                            //@ts-ignore
                            groupedData[empty[key]] = item[key];
                        }
                    }
                    //@ts-ignore
                    this.result[objectName] = groupedData;
                });
                for (const key in this.result) {
                    // Удаляем пустые пары
                    for (const innerKey in this.result[key]) {
                        if (this.result[key][innerKey].trim() === "") {
                            delete this.result[key][innerKey]; // Удаляем пустую пару
                        }
                    }
                    // Если объект пустой, удаляем его ключ
                    if (Object.keys(this.result[key]).length === 0) {
                        delete this.result[key];
                    }
                }
            }
        }

        return this.result;
    }
}
