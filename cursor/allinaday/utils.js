export function getCurrentDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

export function calculateDaysAlive() {
    let userDOB = localStorage.getItem('aiad_userDOB') || '';
    if (userDOB) {
        const birthDate = new Date(userDOB);
        const today = new Date();
        const timeDiff = today - birthDate;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    }
    return null;
}

export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

export function loadFromLocalStorage(key) {
    return localStorage.getItem(key) || '';
}