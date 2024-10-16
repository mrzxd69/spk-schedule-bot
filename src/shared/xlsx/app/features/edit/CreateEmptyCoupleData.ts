export class CreateEmptyCoupleData {
    private result: object = [];
    private data: Array<any>;

    constructor(data: Array<any>) {
        this.data = data;
    }

    public CreateEmptyCoupleData(): object {
        for (const index in this.data) {
            const item = this.data[index];

            if (String(item.__EMPTY).toLowerCase().includes("препо")) {
                Object.entries(item).forEach(([res, val]) => {
                    if (res !== "__EMPTY") {
                        //@ts-ignore
                        this.result.push({ [res]: String(val).split(" ")[0] });
                    }
                });
            }
        }
        //@ts-ignore
        return this.result = this.result.reduce((acc, curr) => {
            //@ts-ignore
            return { ...acc, ...curr };
        }, {});
    }
}
