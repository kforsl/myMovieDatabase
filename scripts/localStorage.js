function getLocalStorage(key) {
    const storedArray = localStorage.getItem(key)
    return JSON.parse(storedArray)
}

function addLocalStorage(key, value) {
    localStorage.setItem(key, value)
}

export { getLocalStorage, addLocalStorage }