import {
    renderStartPage,
    toggleFavorit,
    renderInformationCard,
    checkStars,
    renderFavoritPage,
    renderSearchPage,
} from "./dom.js";

import {
    fetchMore,
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

})

async function movieCardEvent(event) {
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
        localStorage.setItem(`searchString`, JSON.stringify(searchString.value))
        searchString.value = ``
        window.location = `./search.html`
    } else {
        console.log(`empty`);
    }


}

export {
    movieCardEvent
}