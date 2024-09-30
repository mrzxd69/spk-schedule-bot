// import { format } from "@formkit/tempo";

// const date = new Date();

// console.log(format({
//     date,
//     format: "DD.MM",
//     tz: "Asia/Omsk"
// }))
import { listenChannel } from '@userbot/listenChannel';
import { botService } from '@src/bot';
import { prisma } from '@postgresql/prisma';
import { sendMySchedule } from '@bot/inline/schedule';

await botService.start();
await listenChannel();
await prisma.$connect();
await sendMySchedule();