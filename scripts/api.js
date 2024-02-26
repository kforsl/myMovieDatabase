// OMDBAPI-Key Variables, change to use your own key 
const apiKey = `810608b8`;

// Function to fetch information from an Api and converting to json  
async function fetchApi(apiUrl) {
    try {
        const results = await fetch(apiUrl);
        return await results.json()
    } catch (error) {
        console.log(error);
    }
}

// Function to get information about a specific movie from the omdbApi
async function fetchMore(id) {
    try {
        return await fetchApi(`http://www.omdbapi.com/?apikey=${apiKey}&plot=full&i=${id}`)
    } catch (error) {
        console.log(error);
    }
}

// Function to get the search resaults from the omdbApi
async function fetchSearch(input) {
    try {
        const searchResult = await fetchApi(`http://www.omdbapi.com/?apikey=${apiKey}&plot=full&s=${input}`)
        return searchResult.Search
    } catch (error) {
        console.log(error);
    }
}

export {
    fetchApi,
    fetchMore,
    fetchSearch,
}