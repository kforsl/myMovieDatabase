function getLocalStorage(key) {
    const storedArray = localStorage.getItem(key)
    return JSON.parse(storedArray)
}

function addLocalStorage(key, value) {
    localStorage.setItem(key, value)
}

function clearLocalStorage(key) {
    localStorage.clear(key)
}

export { getLocalStorage, addLocalStorage, clearLocalStorage }