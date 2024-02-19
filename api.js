async function fetchApi(apiUrl) {
    const results = await fetch(apiUrl);
    return await results.json()
}

