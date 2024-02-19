import {
    fetchApi,
} from "./api.js";

import {
    movieCardEvent,
} from "./app.js";

async function renderStartPage() {
    const topMovies = await fetchApi(`https://santosnr6.github.io/Data/movies.json`);

    const topMoviesRef = document.createElement(`section`);
    topMoviesRef.classList.add(`top-movies`);
    document.querySelector(`main`).appendChild(topMoviesRef);

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
    artRef.appendChild(h3Ref);
}

function toggleFavorit(star) {
    if (star.dataset.favorit === `false`) {
        star.dataset.favorit = true;
        star.src = `./icons/favorite-fill.svg`
    } else if (star.dataset.favorit === `true`) {
        star.dataset.favorit = false;
        star.src = `./icons/favorite-outline.svg`
    }
}

export {
    renderStartPage,
    toggleFavorit,
}