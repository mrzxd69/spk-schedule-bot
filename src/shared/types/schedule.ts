type LessonStatus = "JOINED" | "SubGroup1" | "SubGroup2";

export interface ICheckLessonExist {
    count: number,
    group: string,
    date: string,
    status: LessonStatus,
    room: string
}

export interface IsendSchedule {
    userId: number,
    text: string
}

export interface ILesson {
    id: number;
    group: string;
    count: number;
    descipline: string;
    status: LessonStatus;
    date: string;
    room: string;
}


export interface ITeacherLesson {
    teacher: string,
    status: string,
    lesson: string,
    group: string,
    count: string,
    room: string,
    date: string,
}