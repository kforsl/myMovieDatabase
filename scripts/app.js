import {
    renderStartPage,
    toggleFavorit,
    renderInformationCard,
    checkStars,
    renderFavoritPage,
    renderSearchPage,
    renderSearchOptions,
} from "./dom.js";

import {
    fetchMore,
    fetchSearch,
} from "./api.js";

window.addEventListener(`load`, async () => {
    if (window.location.href.includes(`movie`)) {
        const movieInformationString = localStorage.getItem(`clickedMovie`)
        const movieInformationObject = JSON.parse(movieInformationString)
        renderInformationCard(movieInformationObject)
        checkStars()
    } else if (window.location.href.includes(`favorit`)) {
        renderFavoritPage()

    } else if (window.location.href.includes(`search`)) {
        renderSearchPage()

    } else {
        renderStartPage()
    }
    document.querySelector(`.header__search-btn`).addEventListener(`click`, searchMovieEvent)
    document.querySelector(`#searchMovie`).addEventListener(`input`, searchMovieEvent)

})

async function movieCardEvent(event) {
    console.log(event.target);
    if (event.target.src === undefined) {
        const movieInformation = await fetchMore(event.target.dataset.id)
        localStorage.setItem(`clickedMovie`, JSON.stringify(movieInformation))
        window.location = `./movie.html`
    } else if (event.target.src.includes(`favorite`)) {
        toggleFavorit(event.target)
    }

    renderFavoritPage()
}

async function searchMovieEvent(event) {
    event.preventDefault()

    if (document.querySelector(`#searchMovie`).value) {
        const searchString = document.querySelector(`#searchMovie`)

        if (event.type === `click`) {
            localStorage.setItem(`searchString`, JSON.stringify(searchString.value))
            searchString.value = ``
            window.location = `./search.html`
        } else if (event.type === `input`) {
            const searchResult = await fetchSearch(searchString.value)
            document.querySelector(`.header__options-container`).textContent = ``
            searchResult.forEach(result => {
                renderSearchOptions(result)
            });
            const options = document.querySelectorAll(`.header__search-options`)
            options.forEach(row => {
                row.addEventListener(`click`, movieCardEvent)
            });
        }
    } else {
        console.log(`empty`);
    }
}

export {
    movieCardEvent
}