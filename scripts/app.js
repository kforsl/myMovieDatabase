import {
    renderStartPage,
    toggleFavorit,
    renderInformationCard,
    checkStars,
    renderFavoritPage,
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
        checkStars()
    } else {
        renderStartPage()

    }
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

export {
    movieCardEvent
}