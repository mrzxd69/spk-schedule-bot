export class CreateEmptyCoupleData {
    private result: object = []
    private data: Array<any>;

    constructor(data: Array<any>) {
        this.data = data;
    }

    public CreateEmptyCoupleData(): object {
        for (const index in this.data) {
            const item = this.data[index];
            if (Number(item.__EMPTY_1.match(/\d+/g))) {
                this.result = item;
                break;
            }
        }

        return this.result;
    }
}