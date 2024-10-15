import { CreateEmptyData } from "./CreateEmptyData";
import { CreateGroupData } from "./CreateGroupData";

interface CreateMissingNumbers {
	CreateMissingNumbers(array: number[]): number[][];
}

export class CreateScheduleGroup {
	private data: any[];
	private count: number;
	private result: any = {};

	private Empty: CreateEmptyData;
	private Group: CreateGroupData;

	constructor(data: any[], count: number) {
		this.data = data;
		this.count = count;

		this.Empty = new CreateEmptyData(this.data, this.count);
		this.Group = new CreateGroupData(this.data, this.count);
	}

	public CreateScheduleGroup(CreateMissingNumbersEmpty: CreateMissingNumbers, CreateMissingNumbersGroup: CreateMissingNumbers): { [key: string]: { [key: string]: any[][] } } {
		const empty = this.Empty.CreateEmptyData(CreateMissingNumbersEmpty);
		const group = this.Group.CreateGroupData(CreateMissingNumbersGroup);

		this.result = empty.map((keyGroup) => {
			return group
				.map((item) => {
					//@ts-ignore
					return keyGroup.map((key) => item[key] || null).filter((value) => value !== null);
				})
				.filter((arr) => arr.length > 0);
		});

		return this.result;
	}
}
