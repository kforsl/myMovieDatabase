const apiKey = `810608b8`;

async function fetchMore(id) {
    return await fetchApi(`http://www.omdbapi.com/?apikey=${apiKey}&plot=full&i=${id}`)
}

async function fetchApi(apiUrl) {
    const results = await fetch(apiUrl);
    return await results.json()
}

