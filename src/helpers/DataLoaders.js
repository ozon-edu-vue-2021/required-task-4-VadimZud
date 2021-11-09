import citizenships from "../assets/data/citizenships.json";
// import passportTypes from "../assets/data/passport-types.json"

// В реальном проекте эти функции будут, вероятно, основаны на fetch, а значит
// их можно будет прерывать при помощи AbortController, и они будут поднимать исключения
// AbortError. В данном примере будем эмулировать такое поведение.
class AbortError extends Error {
    constructor(message) {
        super(message);
        this.name = "AbortError";
    }
}

// Будем эмулировать "долгие" асинхронные функции
export function loadCitizenshipsOptions(filter = "", controller = null) {
    return new Promise((resolve, reject) => {
        if (controller) {
            controller.signal.addEventListener("abort", () => {
                reject(new AbortError("Операция прервана пользователем"));
            });
        }

        const lowerCaseFilter = filter.toLowerCase();
        let i = 0;
        let res = [];
        const loadItem = function () {
            if (i < citizenships.length) {
                if (citizenships[i].nationality.toLowerCase().includes(lowerCaseFilter)) {
                    res.push({
                        value: citizenships[i].id,
                        display: citizenships[i].nationality,
                    });
                }
                i++;
            } else {
                resolve(res);
            }
            setTimeout(loadItem, 50);
        }
        loadItem();
    });
}

export function loadCitizenshipsDisplayByValue(id, controller = null) {
    return new Promise((resolve, reject) => {
        if (controller) {
            controller.signal.addEventListener("abort", () => {
                reject(new AbortError("Операция прервана пользователем"));
            });
        }

        id = Number(id);
        let i = 0;
        const loadItem = function () {
            if (i < citizenships.length) {
                if (citizenships[i].id === id) {
                    resolve(citizenships[i].nationality);
                }
                i++
            } else {
                reject(new Error(`Гражданство с id=${id} не найдено`));
            }
            setTimeout(loadItem, 50);
        }
        loadItem();
    });
}