export const subGroup: any = {
    1: " Первая подгруппа",
    2: " Вторая подгруппа",
    3: " Третья подгруппа",
};

export const subGroupTeachers: any = {
    "(2гр)": "SubGroup2",
    "(1гр)": "SubGroup1",
    "": "JOINED",
};

export const allowChannelsList = [
    Number(process.env.MAIN_CHANNEL),
    Number(process.env.BACKUP_CHANNEL),
    -1002399306134, // for tests
];
