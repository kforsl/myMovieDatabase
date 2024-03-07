import {
    renderStartPage,
    toggleFavorit,
    renderInformationCard,
    checkStars,
    renderFavoritPage,
    renderSearchPage,
    addRecentlyViewed,
    renderRecentlyViewed,
    renderSearchOptions,
} from "./dom.js";

import {
    fetchMore,
    fetchSearch,
} from "./api.js";

import {
    removeItemLocalStorage
} from "./localStorage.js";

window.addEventListener(`load`, async () => {
    // render the page with movie information if the URL includes "movie"
    if (window.location.href.includes(`movie`)) {
        const movieInformationString = localStorage.getItem(`clickedMovie`);
        const movieInformationObject = JSON.parse(movieInformationString);
        renderInformationCard(movieInformationObject);
        checkStars();
    }
    // render favorit page if the URL includes "favroit"
    else if (window.location.href.includes(`favorit`)) {
        renderFavoritPage();
    }
    // render search page if the URL includes "search"
    else if (window.location.href.includes(`search`)) {
        renderSearchPage();
    }
    // render startPage if none of the above is true 
    else {
        renderStartPage();
    }

    // render the recently viewed in the footer and add eventlisterner
    renderRecentlyViewed();
    document.querySelector(`.header__search-btn`).addEventListener(`click`, searchMovieEvent);

    // add eventlisterner to the clear-btn in the footer to remove the recent movies from html and localStorage
    document.querySelector(`.footer__clear-btn`).addEventListener(`click`, () => {
        removeItemLocalStorage(`recently`);
        document.querySelector(`.footer__recent-grid`).innerHTML = ``;
    })

    // add eventlisteners to moviecard
    document.querySelector(`#searchMovie`).addEventListener(`input`, searchMovieEvent);
})

async function movieCardEvent(event) {
    // run if user click a the moviecard other than the star 
    if (event.target.src === undefined) {
        const movieInformation = await fetchMore(event.target.dataset.id);
        localStorage.setItem(`clickedMovie`, JSON.stringify(movieInformation));
        addRecentlyViewed(event.target.dataset.id);
        window.location = `./movie.html`;
    }
    // runs when user click the star
    else if (event.target.src.includes(`favorite`)) {
        toggleFavorit(this.children, event.target);
    }

    // run function to uppdate favorit page. does nothing if not on a url without favorit. 
    renderFavoritPage();
}

async function searchMovieEvent(event) {
    event.preventDefault();

    if (document.querySelector(`#searchMovie`).value.length > 2) {
        const searchString = document.querySelector(`#searchMovie`);

        // runs if user uses klicks on search-btn 
        if (event.type === `click`) {
            localStorage.setItem(`searchString`, JSON.stringify(searchString.value));
            searchString.value = ``;
            window.location = `./search.html`;
        }
        // runs every input in search feild 
        else if (event.type === `input`) {
            const searchResult = await fetchSearch(searchString.value);

            // uppdate search resluts in the search option container only when new resault is found. 
            if (searchResult !== undefined) {

                // clear all previus results from page
                document.querySelector(`.header__options-container`).textContent = ``;

                // render all the results to the page 
                searchResult.forEach(result => {
                    renderSearchOptions(result);
                });

                // add eventlisterner to the object in the search option container 
                const options = document.querySelectorAll(`.header__search-options`);
                options.forEach(row => {
                    row.addEventListener(`click`, movieCardEvent);
                });
            }
        }
    }
    // clear all the searchoptions if the searchbar is empty 
    else if (document.querySelector(`#searchMovie`).value.length === 0) {
        document.querySelector(`.header__options-container`).textContent = ``;
    }
}

export {
    movieCardEvent
}