import {
    renderStartPage,
    toggleFavorit,
} from "./dom.js";

window.addEventListener(`load`, async () => {
    renderStartPage()
})

function movieCardEvent(event) {

    if (event.target.getAttribute(`class`) === `movies__favorit-star`) {
        toggleFavorit(event.target)
    }

}

export {
    movieCardEvent
}