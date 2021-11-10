export function isCyrillic(text) {
    return /[а-яА-ЯёЁ]+/.test(text);
}

export function isLatin(text) {
    return /[a-zA-Z]+/.test(text);
}

export function isPassportSeries(text) {
    return /\d{4}/.test(text);
}

export function isPassportNumber(text) {
    return /\d{6}/.test(text);
}

export function isBirthdate(text) {
    const date = new Date(text);
    const now = new Date();
    return now - date >= 0;
}

export function isEmail(text) {
    // регулярки для email - это огромный повод для срача
    // думаю лучше пропустить несколько некорректных адресов,
    // чтобы их потом отсеять иным способом (скажем процедурой
    // "активации" почтового адреса), чем отсеять валидный
    // адрес, напрягая пользователя. Некоторые разработчики
    // придерживаются мнения, что достаточно, чтобы почтовый адрес
    // содержал @.
    return /.*@.*/.test(text);
}



export function validateForm(form, error) {
    let err = false;

    if (!form.firstname) {
        error.firstname = "Обязательное поле";
        err = true;
    } else if (!isCyrillic(form.firstname)) {
        error.firstname = "Используйте кириллицу";
        err = true;
    } else {
        error.firstname = "";
    }

    return err;
}