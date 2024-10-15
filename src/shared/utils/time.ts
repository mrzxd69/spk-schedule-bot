import { format as formatTime, parse } from "@formkit/tempo";

export const getDate = (tomorrow: boolean) => {
    const date = new Date();

    if (tomorrow) date.setDate(date.getDate() + 1);

    return formatTime({
        date,
        format: "full",
        tz: "Asia/Omsk",
        locale: "ru",
    }).split(" 2024")[0];
};


export const getDefineDate = (date: string) => {
    const year = new Date().getFullYear();

    const a = parse({
        date: `${date}.${year}`,
        format: "short",
        locale: "ru",
    });

    return formatTime({
        date: a,
        format: "full",
        tz: "Asia/Omsk",
        locale: "ru",
    }).split(" 2024")[0];
}