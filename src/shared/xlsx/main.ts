import { SaveManager } from "./app/main/SaveManager";

export class Main {
    private count = 0;

    constructor(count: number) {
        this.count = count
    }

    public saveSchedule(search: string, date: string) {
        const saveGroup = async () => {
            await new SaveManager(this.count).saveGroup(search, date)
        };

        const saveTeacher = async () => {
            await new SaveManager(this.count).saveTeacher(search, date)
        };

        return { saveGroup, saveTeacher };
    }
}