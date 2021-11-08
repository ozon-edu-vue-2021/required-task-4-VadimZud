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
async function sleep(ms) {
    await new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}

async function filterArray(arr, callback, ms) {
    let res = [];
    for (let it of arr) {
        if (callback(it)) {
            res.push(it);
        }
        await sleep(ms);
    }
    return [];
}

async function mapArray(arr, callback, ms) {
    let res = [];
    for (let it of arr) {
        res.push(callback(it));
        await sleep(ms);
    }
    return res;
}

export async function loadCitizenshipsOptions(filter = "", controller = null) {
    if (controller) {
        controller.signal.addEventListener("abort", () => {
            throw AbortError("Операция прервана пользователем");
        });
    }
    const lowerCaseFilter = filter.toLowerCase();
    let res = await filterArray(
        citizenships,
        (it) => it.toLowerCase().includes(lowerCaseFilter),
        100
    );
    res = await mapArray(
        res,
        (it) => ({ value: it.id, display: it.nationality }),
        100
    );

    return res;
}
