export function getCurrentDayOfYear() {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
    const diff = now.getTime() - start.getTime();
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

export function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
}

export function isInPast(date) {
    const today = new Date();
    return date < today;
}

export function isInFuture(date) {
    const today = new Date();
    return date > today;
}