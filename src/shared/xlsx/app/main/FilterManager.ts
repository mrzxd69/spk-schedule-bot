export class FilterManager {
    private result: object = {}

    public TransformedDataTeacher(scheduleT: object): object {
        this.result = Object.entries(scheduleT)
            .reduce((acc, [surname, entries]) => {
                //@ts-ignore
                acc[surname] = entries.reduce((obj, [coup, name, off]) => {
                    const key_number = Number(String(coup).split(" ")[0])
                    const data = name + " " + "&&" + off
                    obj[key_number] = data;

                    return obj;
                }, {});
                return acc;
            }, {});

        return this.result
    }

    public transformedGroup(scheduleG: object): object {
        //@ts-ignore
        scheduleG.forEach(sectionArray => {
            const groupName = sectionArray[0][0]; // Получаем имя группы из первого элемента
            const dataObject: { [key: string]: any[][] } = {};

            for (let i = 1; i < sectionArray.length; i++) {
                const innerArray = sectionArray[i];

                const key = innerArray[0];
                const values = innerArray.slice(1);

                if (!dataObject[key]) {
                    dataObject[key] = [];
                }
                dataObject[key].push(values);


            }

            if (Object.keys(dataObject).length === 0) {
                //@ts-ignore
                this.result[groupName] = "Нет пар";
            } else {
                //@ts-ignore
                this.result[groupName] = dataObject;
            }

            if (String(groupName).includes("корп")) {
                //@ts-ignore
                delete this.result
            }
        });

        return this.result;
    }
}
