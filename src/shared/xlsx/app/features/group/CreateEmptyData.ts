interface CreateMissingNumbers {
	CreateMissingNumbers(array: number[]): number[][];
}

export class CreateEmptyData {
	private result: any[][] = [];
	private data: any[];
	private count: number;

	constructor(data: any[], count: number) {
		this.data = data;
		this.count = count;
	}

	private filter(create: CreateMissingNumbers): number[][] {
		for (const index in this.data) {
			if (this.data[index].__EMPTY && !Number.isFinite(Number(this.data[index].__EMPTY))) {
				this.result.push(this.data[index]);
			}
		}

		const keysNumber = Object.keys(this.result[this.count]).map((res) => Number(res.split("__EMPTY_")[1]) || 0);

		this.result = create.CreateMissingNumbers(keysNumber);
		this.result[0].unshift(null);

		const lastArray = this.result[this.result.length - 1];

		const startNumber = lastArray[lastArray.length - 1] + 1;
		const targetLength = this.result[0].length - lastArray.length;

		for (let i = 0; i < targetLength; i++) {
			lastArray.push(startNumber + i);
		}

		return this.result;
	}

	public CreateEmptyData(create: CreateMissingNumbers): string[][] {
		this.result = this.filter(create).map((value) => value.map((res) => (res === null ? "__EMPTY" : "__EMPTY_" + res)));

		return this.result;
	}
}
