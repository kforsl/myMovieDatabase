const apiKey = `810608b8`;

async function fetchMore(id) {
    return await fetchApi(`http://www.omdbapi.com/?apikey=${apiKey}&plot=full&i=${id}`)
}

async function fetchSearch(input) {
    const searchResult = await fetchApi(`http://www.omdbapi.com/?apikey=${apiKey}&plot=full&s=${input}`)
    return searchResult.Search
}

async function fetchApi(apiUrl) {
    const results = await fetch(apiUrl);
    return await results.json()
}

export {
    fetchApi,
    fetchMore,
    fetchSearch,
}