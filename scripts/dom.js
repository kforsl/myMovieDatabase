import {
    fetchApi,
    fetchMore,
    fetchSearch,
} from "./api.js";

import {
    movieCardEvent,
} from "./app.js";

import {
    getLocalStorage,
    addLocalStorage
} from "./localStorage.js";

async function renderStartPage() {
    const topMovies = await fetchApi(`https://santosnr6.github.io/Data/movies.json`);

    const usedNmbrs = [];

    while (usedNmbrs.length < 5) {
        const randomNmbr = Math.floor(Math.random() * topMovies.length)
        if (!usedNmbrs.includes(randomNmbr)) {
            usedNmbrs.push(randomNmbr);
        }
    }

    let trailernmbr = 1
    usedNmbrs.forEach(nmbr => {
        renderTrailers(topMovies[nmbr], trailernmbr)
        trailernmbr++
    });

    topMovies.forEach(movie => {
        renderTopMovieCard(movie);
    });

    document.querySelectorAll(`.movies__card`).forEach(card => {
        card.addEventListener(`click`, movieCardEvent);
    })

    const trailerList = document.querySelectorAll(`.trailers__video`)
    const trailerArray = Array.from(trailerList)

    document.querySelectorAll(`.trailers__arrow`).forEach(arrow => {
        arrow.addEventListener(`click`, (event) => {
            changeTrailer(event, trailerList, trailerArray)

        })
    })

    checkStars()
}

function changeTrailer(event, trailerList, trailerArray) {

    if (event.target.dataset.direction === `right`) {
        trailerArray.push(trailerArray.shift());
    } else if (event.target.dataset.direction === `left`) {
        trailerArray.unshift(trailerArray.pop());
    }

    trailerList.forEach(item => {
        item.classList.remove(
            `trailers__video-1`,
            `trailers__video-2`,
            `trailers__video-3`,
            `trailers__video-4`,
            `trailers__video-5`
        )
    })

    trailerArray.slice(0, 5).forEach((item, i) => {
        item.classList.add(`trailers__video-${i + 1}`)
    });
}

async function renderFavoritPage() {
    const favorits = getLocalStorage(`favorits`);

    if (window.location.href.includes(`favorit`)) {

        document.querySelector(`.movies__card-container`).textContent = ``;

        for (let i = 0; i < favorits.length; i++) {
            const movie = await fetchMore(favorits[i])
            renderMovieCard(movie)
            checkStars()
        }

        document.querySelectorAll(`.movies__card`).forEach(card => {
            card.addEventListener(`click`, movieCardEvent);
        })
    }

}

async function renderSearchPage() {
    const input = getLocalStorage(`searchString`);
    const searchResults = await fetchSearch(input)
    if (window.location.href.includes(`search`)) {

        const h2Ref = document.querySelector(`.movies__section-title`);
        h2Ref.textContent = `Top 10 results for ${input}`;

        document.querySelector(`.movies__card-container`).textContent = ``;

        searchResults.forEach(movie => {
            renderMovieCard(movie)
        });

        document.querySelectorAll(`.movies__card`).forEach(card => {
            card.addEventListener(`click`, movieCardEvent);
        })
    }
    checkStars()
}

function renderTopMovieCard(movie) {
    const artRef = document.createElement(`article`);
    artRef.classList.add(`movies__card`);
    artRef.dataset.id = movie.imdbid;
    document.querySelector(`.top-movies__card-container`).appendChild(artRef);

    let imgRef = document.createElement(`img`);
    imgRef.src = movie.poster;
    imgRef.alt = `${movie.title} poster`;
    imgRef.classList.add(`movies__card-poster`);
    artRef.appendChild(imgRef);

    imgRef = document.createElement(`img`);
    imgRef.dataset.id = movie.imdbid;
    imgRef.dataset.favorit = false;
    imgRef.src = `./icons/favorite-outline.svg`;
    imgRef.alt = `Favorit Star`;
    imgRef.classList.add(`movies__favorit-star`);
    artRef.appendChild(imgRef);

    const h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movies__card-title`);
    h3Ref.textContent = movie.title;
    artRef.appendChild(h3Ref)
}

function renderMovieCard(movie) {
    const artRef = document.createElement(`article`);
    artRef.classList.add(`movies__card`);
    artRef.dataset.id = movie.imdbID;
    document.querySelector(`.movies__card-container`).appendChild(artRef);

    let imgRef = document.createElement(`img`);
    imgRef.src = movie.Poster;
    imgRef.alt = `${movie.Title} poster`;
    imgRef.classList.add(`movies__card-poster`);
    artRef.appendChild(imgRef);

    imgRef = document.createElement(`img`);
    imgRef.dataset.id = movie.imdbID;
    imgRef.dataset.favorit = false;
    imgRef.src = `./icons/favorite-outline.svg`;
    imgRef.alt = `Favorit Star`;
    imgRef.classList.add(`movies__favorit-star`);
    artRef.appendChild(imgRef);

    const h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movies__card-title`);
    h3Ref.textContent = movie.Title;
    artRef.appendChild(h3Ref)
}

function renderRecentlyCard(movie) {
    const artRef = document.createElement(`article`);
    artRef.classList.add(`recent-movie__card`);
    artRef.dataset.id = movie.imdbID;
    document.querySelector(`.footer__recent-grid`).appendChild(artRef);

    let imgRef = document.createElement(`img`);
    imgRef.src = movie.Poster;
    imgRef.alt = `${movie.Title} poster`;
    imgRef.classList.add(`recent-movie__card-poster`);
    artRef.appendChild(imgRef);

    artRef.addEventListener(`click`, movieCardEvent)
}

function toggleFavorit(star) {
    const Response = getLocalStorage(`favorits`)
    let favoritsArray = []

    if (Response === null || Response.length === 0) {
        favoritsArray.push(star.dataset.id)
    } else {
        Response.forEach(id => {
            favoritsArray.push(id)
        });
        favoritsArray.push(star.dataset.id)
    }

    if (star.dataset.favorit === `false`) {
        star.dataset.favorit = true;
        star.src = `./icons/favorite-fill.svg`

    } else if (star.dataset.favorit === `true`) {
        favoritsArray = favoritsArray.filter(id => id !== star.dataset.id)
        star.dataset.favorit = false;
        star.src = `./icons/favorite-outline.svg`
    }

    addLocalStorage(`favorits`, JSON.stringify(favoritsArray))
}

function renderTrailers(movie, num) {
    const iFrameRef = document.createElement(`iframe`);
    iFrameRef.classList.add(`trailers__video`, `trailers__video-${num}`)
    iFrameRef.src = movie.trailer_link
    iFrameRef.dataset.index = num
    document.querySelector(`.trailers__container`).appendChild(iFrameRef)
}

async function renderInformationCard(movieInformation) {



    /* Movie Information Card */
    const artRef = document.createElement(`article`);
    artRef.classList.add(`movie-information__card`);
    document.querySelector(`.movie-information`).appendChild(artRef);

    let sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`movie-information__title-container`);
    artRef.appendChild(sectionRef);

    const h2Ref = document.createElement(`h2`);
    h2Ref.classList.add(`movie-information__movie-title`);
    h2Ref.textContent = movieInformation.Title;
    sectionRef.appendChild(h2Ref);

    let imgRef = document.createElement(`img`);
    imgRef.src = `./icons/favorite-outline.svg`;
    imgRef.alt = `Favorit Star`;
    imgRef.dataset.favorit = false;
    imgRef.dataset.id = movieInformation.imdbID;
    imgRef.addEventListener(`click`, movieCardEvent)
    sectionRef.appendChild(imgRef);

    sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`movie-information__information-container`);
    artRef.appendChild(sectionRef);

    /* Image Container ELements */
    const figRef = document.createElement(`figure`);
    figRef.classList.add(`movie-information__image-container`);
    sectionRef.appendChild(figRef);

    imgRef = document.createElement(`img`);
    imgRef.src = movieInformation.Poster;
    imgRef.alt = `${movieInformation.Title} poster`;
    figRef.appendChild(imgRef);

    /* Text Container ELements */
    const sectionRefTwo = document.createElement(`section`);
    sectionRefTwo.classList.add(`movie-information__text-container`);
    sectionRef.appendChild(sectionRefTwo);

    /* Top Section Elements */
    let divRef = document.createElement(`div`);
    divRef.classList.add(`movie-information__top-section`);
    sectionRefTwo.appendChild(divRef);

    const tags = [
        `Rated: ${movieInformation.Rated}`,
        `Genre: ${movieInformation.Genre}`,
        `Runtime: ${movieInformation.Runtime}`,
        `Released: ${movieInformation.Released}`,
        `Ratings: ${movieInformation.Ratings[0].Value}`
    ]
    tags.forEach(tag => {
        let pRef = document.createElement(`p`);
        pRef.classList.add(`movie-information__movie-tags`)
        pRef.textContent = tag;
        divRef.appendChild(pRef);
    });



    /* Middle Section Elements  */
    divRef = document.createElement(`div`);
    divRef.classList.add(`movie-information__middle-section`);
    sectionRefTwo.appendChild(divRef);

    let h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Plot`
    divRef.appendChild(h3Ref);

    let pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Plot;
    divRef.appendChild(pRef);



    /* Bottom Section Elements */
    divRef = document.createElement(`div`);
    divRef.classList.add(`movie-informtain__bottom-section`);
    sectionRefTwo.appendChild(divRef);

    let divTwoRef = document.createElement(`div`);
    divRef.appendChild(divTwoRef);

    h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Director: `
    divTwoRef.appendChild(h3Ref);

    pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Director;
    divTwoRef.appendChild(pRef);

    divTwoRef = document.createElement(`div`);
    divRef.appendChild(divTwoRef);

    h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Writer: `
    divTwoRef.appendChild(h3Ref);

    pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Writer;
    divTwoRef.appendChild(pRef);

    divTwoRef = document.createElement(`div`);
    divRef.appendChild(divTwoRef);

    h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Actors: `
    divTwoRef.appendChild(h3Ref);

    pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Actors;
    divTwoRef.appendChild(pRef);

    /* Bottom Right Elements  */

}

function checkStars() {
    try {
        const favorits = getLocalStorage(`favorits`)
        const imgRef = document.querySelectorAll(`img`)
        imgRef.forEach(node => {
            if (node.alt === `Favorit Star`) {
                if (favorits.includes(node.getAttribute(`data-id`))) {
                    node.src = `./icons/favorite-fill.svg`;
                    node.dataset.favorit = true;
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function addRecentlyViewed(id) {
    let response = getLocalStorage(`recently`)
    let recentlyArray = []

    if (response === null || response.length === 0) {
        recentlyArray.unshift(id)
    } else {
        response = response.filter(item => item !== id)

        response.forEach(id => {
            if (recentlyArray.length < 6) {
                recentlyArray.push(id)
            }
        });
        recentlyArray.unshift(id)
    }
    addLocalStorage(`recently`, JSON.stringify(recentlyArray))
}

async function renderRecentlyViewed() {
    try {
        const response = getLocalStorage(`recently`)

        if (response !== null) {
            for (let i = 0; i < response.length; i++) {
                const movie = await fetchMore(response[i])

                renderRecentlyCard(movie)
            }
        }

    } catch (error) {
        console.log(error);
    }

}

function renderSearchOptions(movie) {
    const artRef = document.createElement(`article`);
    artRef.dataset.id = movie.imdbID;
    artRef.classList.add(`header__search-options`);

    let pRef = document.createElement(`p`)
    pRef.textContent = movie.Title
    artRef.appendChild(pRef)

    pRef = document.createElement(`p`)
    pRef.textContent = movie.Year
    artRef.appendChild(pRef)

    document.querySelector(`.header__options-container`).appendChild(artRef)

}

export {
    renderStartPage,
    toggleFavorit,
    renderInformationCard,
    checkStars,
    renderFavoritPage,
    renderSearchPage,
    addRecentlyViewed,
    renderRecentlyViewed,
    renderSearchOptions,
}