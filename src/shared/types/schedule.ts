export interface ICheckLessonExist {
    count: number,
    group: string,
    date: string,
    status: "JOINED" | "SubGroup1" | "SubGroup2",
    room: string
}

export interface IsendSchedule {
    userId: number,
    text: string
}