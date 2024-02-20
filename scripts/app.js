import {
    renderStartPage,
    toggleFavorit,
    renderInformationCard,
} from "./dom.js";

import {
    fetchMore,
} from "./api.js";

window.addEventListener(`load`, async () => {
    if (window.location.href.includes(`index`)) {
        renderStartPage()
    } else if (window.location.href.includes(`movie`)) {
        const movieInformationString = localStorage.getItem(`clickedMovie`)
        const movieInformationObject = JSON.parse(movieInformationString)
        renderInformationCard(movieInformationObject)
    }
})



async function movieCardEvent(event) {

    if (event.target.getAttribute(`class`) === `movies__favorit-star`) {
        toggleFavorit(event.target)
    } else {
        const movieInformation = await fetchMore(event.target.dataset.id)
        localStorage.setItem(`clickedMovie`, JSON.stringify(movieInformation))
        window.location = `./movie.html`
    }

}

export {
    movieCardEvent
}