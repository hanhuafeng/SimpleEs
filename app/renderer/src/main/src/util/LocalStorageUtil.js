function generateUUID() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now(); // use high-precision timer if available
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // eslint-disable-next-line no-bitwise
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        // eslint-disable-next-line no-bitwise
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}

export function initStorage(callback) {
    window.addEventListener('storage', callback);
}

export function removeStorage(callback) {
    window.removeEventListener('storage', callback);
}

export function setItem(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify({
            storageId: generateUUID(),
            value,
        }),
    );
}

export function removeItem(key) {
    localStorage.removeItem(key);
}

export function getItem(key, remove = false) {
    try {
        const item = JSON.parse(localStorage.getItem(key));
        if (remove) {
            localStorage.removeItem(key);
        }
        return item;
    } catch (e) {
        const item = localStorage.getItem(key);
        if (remove) {
            localStorage.removeItem(key);
        }
        return item;
    }
}

