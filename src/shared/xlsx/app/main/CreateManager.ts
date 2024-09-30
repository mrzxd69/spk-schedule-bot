import { CreateScheduleGroup } from "../features/group/CreateScheduleGroup";
import { CreateMissingNumbers } from "../features/group/CreateMissNumber";
import { CreateEmptyCoupleData } from "../features/teacher/CreateEmptyCoupleData";
import { CreateScheduleTeacher } from "../features/teacher/CreateScheduleTeacher";

export class CreateManager {
    private CreateMissingNumbersEmpty: CreateMissingNumbers;
    private CreateMissingNumbersGroup: CreateMissingNumbers;

    private CreateEmptyCoupleData: CreateEmptyCoupleData;
    private CreateScheduleGroup: CreateScheduleGroup;
    private CreateScheduleTeacher: CreateScheduleTeacher

    constructor(
        private data: Array<any>,
        private counter: number
    ) {
        this.CreateMissingNumbersEmpty = new CreateMissingNumbers
        this.CreateMissingNumbersGroup = new CreateMissingNumbers

        this.CreateEmptyCoupleData = new CreateEmptyCoupleData(this.data)

        this.CreateScheduleGroup = new CreateScheduleGroup(this.data, this.counter)
        this.CreateScheduleTeacher = new CreateScheduleTeacher(this.data)
    }

    public createScheduleGroup() {
        return this.CreateScheduleGroup.CreateScheduleGroup(this.CreateMissingNumbersEmpty, this.CreateMissingNumbersGroup)
    }

    public createScheduleTeacher() {
        return this.CreateScheduleTeacher.CreateScheduleTeacher(this.CreateEmptyCoupleData.CreateEmptyCoupleData())
    }

}