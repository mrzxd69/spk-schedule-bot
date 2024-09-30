export class CreateMissingNumbers {
    private result: number[][] = []

    public CreateMissingNumbers(array: number[]): number[][] {
        for (let i = 0; i < array.length - 1; i++) {
            const current = array[i];
            const next = array[i + 1];

            const currentArray: number[] = [];
            currentArray.push(current);

            for (let j = current + 1; j < next; j++) {
                currentArray.push(j);
            }
            this.result.push(currentArray);
        }
        this.result.push([array[array.length - 1]]);

        return this.result;
    }
}