const apiKey = `810608b8`;

async function fetchMore(id) {
    try {
        return await fetchApi(`http://www.omdbapi.com/?apikey=${apiKey}&plot=full&i=${id}`)
    } catch (error) {
        console.log(error);
    }

}

async function fetchSearch(input) {
    try {
        const searchResult = await fetchApi(`http://www.omdbapi.com/?apikey=${apiKey}&plot=full&s=${input}`)
        return searchResult.Search
    } catch (error) {
        console.log(error);
    }

}

async function fetchApi(apiUrl) {
    try {
        const results = await fetch(apiUrl);
        return await results.json()
    } catch (error) {
        console.log(error);
    }

}

export {
    fetchApi,
    fetchMore,
    fetchSearch,
}