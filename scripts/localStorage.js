// function to get information saved in localStorage 
function getLocalStorage(key) {
    const storedArray = localStorage.getItem(key)
    return JSON.parse(storedArray)
}

// function to add information to localStorage 
function addLocalStorage(key, value) {
    localStorage.setItem(key, value)
}

// function to remove a key item from localStorage 
function removeItemLocalStorage(key) {
    localStorage.removeItem(key)
}

export { getLocalStorage, addLocalStorage, removeItemLocalStorage }