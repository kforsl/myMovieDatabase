import {
    fetchApi,
    fetchMore,
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

    const topMoviesRef = document.createElement(`section`);
    topMoviesRef.classList.add(`top-movies`);

    document.querySelector(`main .wrapper`).appendChild(topMoviesRef);

    const h2Ref = document.createElement(`h2`);
    h2Ref.textContent = `My Movie Database Top 20`;
    h2Ref.classList.add(`top-movies__section-title`);
    topMoviesRef.appendChild(h2Ref);

    const containerRef = document.createElement(`section`);
    containerRef.classList.add(`top-movies__card-container`);
    topMoviesRef.appendChild(containerRef);

    topMovies.forEach(movie => {
        renderTopMovieCard(movie);
    });

    document.querySelectorAll(`.movies__card`).forEach(card => {
        card.addEventListener(`click`, movieCardEvent);
    })

    checkStars()
}

async function renderFavoritPage() {
    const favorits = getLocalStorage(`favorits`);

    if (window.location.href.includes(`favorit`)) {
        if (document.querySelector(`.movies__card-container`) === null) {

            const topMoviesRef = document.createElement(`section`);
            topMoviesRef.classList.add(`movies`);

            document.querySelector(`main .wrapper`).appendChild(topMoviesRef);

            const h2Ref = document.createElement(`h2`);
            h2Ref.textContent = `My Favorit Movies`;
            h2Ref.classList.add(`movies__section-title`);
            topMoviesRef.appendChild(h2Ref);

            const containerRef = document.createElement(`section`);
            containerRef.classList.add(`movies__card-container`);
            document.querySelector(`main .movies`).appendChild(containerRef);
        }

        document.querySelector(`.movies__card-container`).textContent = ``;

        for (let i = 0; i < favorits.length; i++) {
            const movie = await fetchMore(favorits[i])
            renderMovieCard(movie)
        }

        document.querySelectorAll(`.movies__card`).forEach(card => {
            card.addEventListener(`click`, movieCardEvent);
        })
    }

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
    imgRef.dataset.favorit = true;
    imgRef.src = `./icons/favorite-fill.svg`;
    imgRef.alt = `Favorit Star`;
    imgRef.classList.add(`movies__favorit-star`);
    artRef.appendChild(imgRef);

    const h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movies__card-title`);
    h3Ref.textContent = movie.Title;
    artRef.appendChild(h3Ref)
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

async function renderInformationCard(movieInformation) {

    let sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`movie-information`);
    document.querySelector(`main .wrapper`).appendChild(sectionRef);

    /* Movie Information Card */
    const artRef = document.createElement(`article`);
    artRef.classList.add(`movie-information__card`);
    sectionRef.appendChild(artRef);

    /* Image Container ELements */
    sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`movie-information__image-container`);
    artRef.appendChild(sectionRef);

    let imgRef = document.createElement(`img`);
    imgRef.src = movieInformation.Poster;
    imgRef.alt = `${movieInformation.Title} poster`;
    sectionRef.appendChild(imgRef);

    /* Text Container ELements */
    sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`movie-information__text-container`);
    artRef.appendChild(sectionRef);

    /* Top Section Elements */
    let divRef = document.createElement(`div`);
    divRef.classList.add(`movie-information__top-section`);
    sectionRef.appendChild(divRef);

    const h2Ref = document.createElement(`h2`);
    h2Ref.classList.add(`movie-information__movie-title`);
    h2Ref.textContent = movieInformation.Title;
    divRef.appendChild(h2Ref);

    imgRef = document.createElement(`img`);
    imgRef.src = `./icons/favorite-outline.svg`;
    imgRef.alt = `Favorit Star`;
    imgRef.dataset.favorit = false;
    imgRef.dataset.id = movieInformation.imdbID;
    imgRef.addEventListener(`click`, movieCardEvent)
    divRef.appendChild(imgRef);

    /* Middle Section Elements  */
    divRef = document.createElement(`div`);
    divRef.classList.add(`movie-information__middle-section`);
    sectionRef.appendChild(divRef);

    const tags = [
        `${movieInformation.Type}`,
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

    /* Bottom Section Elements */
    divRef = document.createElement(`div`);
    divRef.classList.add(`movie-informtain__bottom-section`);
    sectionRef.appendChild(divRef);

    /* Bottom Left Elements */
    sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`movie-informtain__bottom-left`);
    divRef.appendChild(sectionRef);

    divRef = document.createElement(`div`);
    sectionRef.appendChild(divRef);

    let h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Director: `
    divRef.appendChild(h3Ref);

    let pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Director;
    divRef.appendChild(pRef);

    divRef = document.createElement(`div`);
    sectionRef.appendChild(divRef);

    h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Writer: `
    divRef.appendChild(h3Ref);

    pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Writer;
    divRef.appendChild(pRef);

    divRef = document.createElement(`div`);
    sectionRef.appendChild(divRef);

    h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Actors: `
    divRef.appendChild(h3Ref);

    pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Actors;
    divRef.appendChild(pRef);


    /* Bottom Right Elements  */
    sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`movie-informtain__bottom-right`);
    document.querySelector(`.movie-informtain__bottom-section`).appendChild(sectionRef);

    h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Plot`
    sectionRef.appendChild(h3Ref);

    pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Plot;
    sectionRef.appendChild(pRef);
}

function checkStars() {
    try {
        const favorits = getLocalStorage(`favorits`)
        const imgRef = document.querySelectorAll(`img`)
        imgRef.forEach(node => {
            if (node.alt === `Favorit Star`) {
                if (favorits.includes(node.getAttribute(`data-id`))) {
                    console.log(`Is in storage`);
                    node.src = `./icons/favorite-fill.svg`;
                    node.dataset.favorit = true;
                }
            }

        });
    } catch (error) {
        console.log(error);
    }
}

export {
    renderStartPage,
    toggleFavorit,
    renderInformationCard,
    checkStars,
    renderFavoritPage,
}