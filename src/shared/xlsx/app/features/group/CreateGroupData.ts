interface CreateMissingNumbers {
    CreateMissingNumbers(array: number[]): number[][];
}

export class CreateGroupData {
    private result: number[] = []
    private data: any[];
    private count: number;

    constructor(data: Array<any>, count: number) {
        this.data = data;
        this.count = count;
    }

    private filterNumber(): number[] {
        let maxNumber: number = 0;

        for (const index in this.data) {
            maxNumber = Math.max(this.data[index].__rowNum__);

            if (this.data[index].__EMPTY && !Number.isFinite(Number(this.data[index].__EMPTY))) {
                this.result.push(this.data[index].__rowNum__);
            }
        }

        this.result.push(maxNumber);

        return this.result;
    }

    private filterEmpty(data: any[]): object[] {
        const uniqueKeys = new Set();

        for (const index in data) {
            Object.keys(data[index]).filter(res => !res.includes("__EMPTY"))
                .forEach(key => uniqueKeys.add(key));

            if (data[index][String(Array.from(uniqueKeys)[0])]) {
                data[index]["__EMPTY_0"] = data[index][String(Array.from(uniqueKeys)[0])];
                delete data[index][String(Array.from(uniqueKeys)[0])];
            }
        }

        return data;
    }

    public CreateGroupData(create: CreateMissingNumbers): object[] {
        const current = create.CreateMissingNumbers(this.filterNumber())[this.count]

        this.result = current.map(res => {
            const foundItem = this.data.find(item => item.__rowNum__ === res);
            return foundItem ? foundItem : res;
        });

        return this.filterEmpty(this.result)
    }

}