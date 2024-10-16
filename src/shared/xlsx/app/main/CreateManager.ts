import { CreateScheduleGroup } from "../features/group/CreateScheduleGroup";
import { CreateMissingNumbers } from "../features/group/CreateMissNumber";
import { CreateEmptyCoupleData as emptyTeacher } from "../features/teacher/CreateEmptyCoupleData";
import { CreateEmptyCoupleData as emptyEdit } from "../features/edit/CreateEmptyCoupleData";
import { CreateScheduleTeacher } from "../features/teacher/CreateScheduleTeacher";
import { CreateScheduleEdit } from "../features/edit/CreateScheduleEdit";

export class CreateManager {
	private CreateMissingNumbersEmpty: CreateMissingNumbers;
	private CreateMissingNumbersGroup: CreateMissingNumbers;

	private emptyTeacher: emptyTeacher;
	private emptyEdit: emptyEdit;
	private CreateScheduleGroup: CreateScheduleGroup;
	private CreateScheduleTeacher: CreateScheduleTeacher;
	private CreateScheduleEdit: CreateScheduleEdit;

	constructor(
		private data: Array<any>,
		private counter: number,
	) {
		this.CreateMissingNumbersEmpty = new CreateMissingNumbers();
		this.CreateMissingNumbersGroup = new CreateMissingNumbers();

		this.emptyTeacher = new emptyTeacher(this.data);
		this.emptyEdit = new emptyEdit(this.data);

		this.CreateScheduleGroup = new CreateScheduleGroup(this.data, this.counter);
		this.CreateScheduleTeacher = new CreateScheduleTeacher(this.data);
		this.CreateScheduleEdit = new CreateScheduleEdit(this.data);
	}

	public createScheduleGroup() {
		return this.CreateScheduleGroup.CreateScheduleGroup(this.CreateMissingNumbersEmpty, this.CreateMissingNumbersGroup);
	}

	public createScheduleTeacher() {
		return this.CreateScheduleTeacher.CreateScheduleTeacher(this.emptyTeacher.CreateEmptyCoupleData());
	}

	public createScheduleEdit() {
		return this.CreateScheduleEdit.CreateScheduleEdit(this.emptyEdit.CreateEmptyCoupleData());
	}
}
