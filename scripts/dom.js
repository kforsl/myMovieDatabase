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


// Render page on load functions 

async function renderStartPage() {
    const topMovies = await fetchApi(`https://santosnr6.github.io/Data/movies.json`);

    const usedNmbrs = [];

    // add five different random number to usedNmbrs array 
    while (usedNmbrs.length < 5) {
        const randomNmbr = Math.floor(Math.random() * topMovies.length);
        if (!usedNmbrs.includes(randomNmbr)) {
            usedNmbrs.push(randomNmbr);
        }
    }

    // render the five trailers to the page. 
    let trailernmbr = 1 // number used in classname to position trailers 
    usedNmbrs.forEach(nmbr => {
        renderTrailers(topMovies[nmbr], trailernmbr);
        trailernmbr++;
    });

    // Render the startpage with to 20 movies 
    topMovies.forEach(movie => {
        renderTopMovieCard(movie);
    });

    // add eventlistener to moviecars 
    document.querySelectorAll(`.movies__card`).forEach(card => {
        card.addEventListener(`click`, movieCardEvent);
    })

    // set an array with the order of the trailes, used to change order on the page
    const trailerList = document.querySelectorAll(`.trailers__video`);
    const trailerArray = Array.from(trailerList);

    // add eventlistener to the arrows in the trailer section to navigate left and right 
    document.querySelectorAll(`.trailers__arrow`).forEach(arrow => {
        arrow.addEventListener(`click`, (event) => {
            changeTrailer(event, trailerList, trailerArray);
        });
    })

    // change all the stars to full if the movie is a favorit
    checkStars();
}

async function renderFavoritPage() {
    const favorits = getLocalStorage(`favorits`);
    console.log(favorits);
    // render the favorit page only when URL includes "favorit "
    if (window.location.href.includes(`favorit`)) {

        // add favorit movies to the page only if the user has added any
        if (favorits !== null) {
            document.querySelector(`.movies__card-container`).textContent = ``;

            favorits.forEach(movie => {
                renderMovieCard(movie);
                checkStars();
            });

            // add eventlistener to the moviecard
            document.querySelectorAll(`.movies__card`).forEach(card => {
                card.addEventListener(`click`, movieCardEvent);
            });
        }

        // Renders out a message if no movie is saved in localStorage
        if (favorits === null || favorits.length === 0) {
            document.querySelector(`.movies__card-container`).innerHTML =
                `<h2> It seems that there are currently no favorite movies listed on your profile.<br>
                Feel free to add your favorite movies to personalize your experience.</h2>`;
        };
    }

}

async function renderSearchPage() {
    // Get search value from localStorage
    const input = getLocalStorage(`searchString`);

    // fetch information from api with search string 
    const searchResults = await fetchSearch(input);

    // check if resault of search found any movies  
    if (searchResults) {
        // render the favorit page only when URL includes "search"
        if (window.location.href.includes(`search`)) {

            const h2Ref = document.querySelector(`.movies__section-title`);
            h2Ref.textContent = `Top 10 results for ${input}`;

            // clears card-container to remove previusly renderd moviecards 
            document.querySelector(`.movies__card-container`).textContent = ``;

            // render moviecard for all the results 
            searchResults.forEach(movie => {
                renderMovieCard(movie);
            });

            // add eventlisterner to the moviecards
            document.querySelectorAll(`.movies__card`).forEach(card => {
                card.addEventListener(`click`, movieCardEvent);
            })
        }
        // change all movies in favorit to solid star on the card
        checkStars();
    }
    // Show message if no results was found 
    else {
        const h2Ref = document.querySelector(`.movies__section-title`);
        h2Ref.textContent = `We're sorry, we could not find any movies with the title: ${input}`;
    }
}

async function renderInformationCard(movieInformation) {

    // Movie Information Card 
    const artRef = document.createElement(`article`);
    artRef.classList.add(`movie-information__card`);
    document.querySelector(`.movie-information`).appendChild(artRef);

    // create container for informationcard to hold movie title and favorit star 
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
    imgRef.addEventListener(`click`, movieCardEvent);
    sectionRef.appendChild(imgRef);

    // create a container for all other information on the card 
    sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`movie-information__information-container`);
    artRef.appendChild(sectionRef);

    // create container for movie poster 
    const figRef = document.createElement(`figure`);
    figRef.classList.add(`movie-information__image-container`);
    sectionRef.appendChild(figRef);

    // create image and set src to poster and missing poster svg if poster is missing 
    imgRef = document.createElement(`img`);
    if (movieInformation.Poster === `N/A`) {
        imgRef.src = `./icons/missing-poster.svg`;
    } else {
        imgRef.src = movieInformation.Poster;
    }
    imgRef.alt = `${movieInformation.Title} poster`;
    figRef.appendChild(imgRef);

    // create container for the text information on the card 
    const sectionRefTwo = document.createElement(`section`);
    sectionRefTwo.classList.add(`movie-information__text-container`);
    sectionRef.appendChild(sectionRefTwo);

    // creare top section for the text information
    let divRef = document.createElement(`div`);
    divRef.classList.add(`movie-information__top-section`);
    sectionRefTwo.appendChild(divRef);

    const tags = []
    if (movieInformation.Rated) {
        tags.push(`Rated: ${movieInformation.Rated}`);
    }
    if (movieInformation.Genre) {
        tags.push(`Genre: ${movieInformation.Genre}`);
    }
    if (movieInformation.Runtime) {
        tags.push(`Runtime: ${movieInformation.Runtime}`);
    }
    if (movieInformation.Released) {
        tags.push(`Released: ${movieInformation.Released}`);
    }
    if (movieInformation.Ratings.length !== 0) {
        tags.push(`Ratings: ${movieInformation.Ratings[0].Value}`);
    }
    tags.forEach(tag => {
        let pRef = document.createElement(`p`);
        pRef.classList.add(`movie-information__movie-tags`);
        pRef.textContent = tag;
        divRef.appendChild(pRef);
    });

    // create middle section for the text information with content about the plot 
    divRef = document.createElement(`div`);
    divRef.classList.add(`movie-information__middle-section`);
    sectionRefTwo.appendChild(divRef);

    let h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Plot`;
    divRef.appendChild(h3Ref);

    let pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Plot;
    divRef.appendChild(pRef);

    // create bottom section for the text information with content about actors, writers and director 
    divRef = document.createElement(`div`);
    divRef.classList.add(`movie-informtain__bottom-section`);
    sectionRefTwo.appendChild(divRef);

    // director 
    let divTwoRef = document.createElement(`div`);
    divRef.appendChild(divTwoRef);

    h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Director: `;
    divTwoRef.appendChild(h3Ref);

    pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Director;
    divTwoRef.appendChild(pRef);

    // writer
    divTwoRef = document.createElement(`div`);
    divRef.appendChild(divTwoRef);

    h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Writer: `;
    divTwoRef.appendChild(h3Ref);

    pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Writer;
    divTwoRef.appendChild(pRef);

    // actors 
    divTwoRef = document.createElement(`div`);
    divRef.appendChild(divTwoRef);

    h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movie-informtain__sub-title`);
    h3Ref.textContent = `Actors: `;
    divTwoRef.appendChild(h3Ref);

    pRef = document.createElement(`p`);
    pRef.classList.add(`movie-informtain__description`);
    pRef.textContent = movieInformation.Actors;
    divTwoRef.appendChild(pRef);
}

// functions for the trailer section 

// function to move the trailers in Carousel
function changeTrailer(event, trailerList, trailerArray) {

    // check what arrow was clicked 
    if (event.target.dataset.direction === `right`) {
        // move first item in array to last position 
        trailerArray.push(trailerArray.shift());
    } else if (event.target.dataset.direction === `left`) {
        // move last item in array to first position  
        trailerArray.unshift(trailerArray.pop());
    }

    // remove all the classes from trailers 
    trailerList.forEach(item => {
        item.classList.remove(
            `trailers__video-1`,
            `trailers__video-2`,
            `trailers__video-3`,
            `trailers__video-4`,
            `trailers__video-5`
        );
    });

    // add class to every trailer for position 
    trailerArray.slice(0, 5).forEach((item, i) => {
        item.classList.add(`trailers__video-${i + 1}`)
    });
}

// function to render the trailers to the dom
function renderTrailers(movie, num) {
    const iFrameRef = document.createElement(`iframe`);
    iFrameRef.classList.add(`trailers__video`, `trailers__video-${num}`);
    iFrameRef.src = movie.trailer_link;
    document.querySelector(`.trailers__container`).appendChild(iFrameRef);
}

// functions for rendering movieCards 

function renderTopMovieCard(movie) {

    // create movie card 
    const artRef = document.createElement(`article`);
    artRef.classList.add(`movies__card`);
    artRef.dataset.id = movie.imdbid;
    document.querySelector(`.top-movies__card-container`).appendChild(artRef);

    // create and set movie poster 
    let imgRef = document.createElement(`img`);
    imgRef.src = movie.poster;
    imgRef.alt = `${movie.title} poster`;
    imgRef.classList.add(`movies__card-poster`);
    artRef.appendChild(imgRef);

    // create and add favorit star to card 
    imgRef = document.createElement(`img`);
    imgRef.dataset.id = movie.imdbid;
    imgRef.dataset.favorit = false;
    imgRef.src = `./icons/favorite-outline.svg`;
    imgRef.alt = `Favorit Star`;
    imgRef.classList.add(`movies__favorit-star`);
    artRef.appendChild(imgRef);

    // create and add movie title to card 
    const h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movies__card-title`);
    h3Ref.textContent = movie.title;
    artRef.appendChild(h3Ref);
}

function renderMovieCard(movie) {

    // create movie card 
    const artRef = document.createElement(`article`);
    artRef.classList.add(`movies__card`);
    artRef.dataset.id = movie.imdbID;
    document.querySelector(`.movies__card-container`).appendChild(artRef);

    // create and set movie poster 
    let imgRef = document.createElement(`img`);
    // set missing poster if poster is missing 
    if (movie.Poster === `N/A`) {
        imgRef.src = `./icons/missing-poster.svg`;
    } else {
        imgRef.src = movie.Poster;
    }
    imgRef.alt = `${movie.Title} poster`;
    imgRef.classList.add(`movies__card-poster`);
    artRef.appendChild(imgRef);

    // create and add favorit star to card 
    imgRef = document.createElement(`img`);
    imgRef.dataset.id = movie.imdbID;
    imgRef.dataset.favorit = false;
    imgRef.src = `./icons/favorite-outline.svg`;
    imgRef.alt = `Favorit Star`;
    imgRef.classList.add(`movies__favorit-star`);
    artRef.appendChild(imgRef);

    // create and add movie title to card 
    const h3Ref = document.createElement(`h3`);
    h3Ref.classList.add(`movies__card-title`);
    h3Ref.textContent = movie.Title;
    artRef.appendChild(h3Ref);
}

// functions for the recently viewed section

function renderRecentlyCard(movie) {

    // generate recently movie card 
    const artRef = document.createElement(`article`);
    artRef.classList.add(`recent-movie__card`);
    artRef.dataset.id = movie.imdbID;
    document.querySelector(`.footer__recent-grid`).appendChild(artRef);

    // create and set movie poster 
    let imgRef = document.createElement(`img`);
    // set missing poster if poster is missing 
    if (movie.Poster === `N/A`) {
        imgRef.src = `./icons/missing-poster.svg`;
    } else {
        imgRef.src = movie.Poster;
    }
    imgRef.alt = `${movie.Title} poster`;
    imgRef.classList.add(`recent-movie__card-poster`);
    artRef.appendChild(imgRef);

    // add eventlistener to moviecard
    artRef.addEventListener(`click`, movieCardEvent);
}

// funktion to add recenly viewed movie to footer 
async function renderRecentlyViewed() {
    try {
        const response = getLocalStorage(`recently`);

        // check if any movies is clicked 
        if (response !== null) {

            // loop and render all the viewed movie 
            for (let i = 0; i < response.length; i++) {
                // get infotmation about movie from api 
                const movie = await fetchMore(response[i]);
                renderRecentlyCard(movie);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// function to add movie to recently viewed when clicked 
function addRecentlyViewed(id) {
    // get all movies from localstorage 
    let response = getLocalStorage(`recently`);
    // create an array 
    let recentlyArray = [];

    // if respones is empty or not existing push id to array 
    if (response === null || response.length === 0) {
        recentlyArray.unshift(id);
    }
    else {

        // remove id from respones if it's the same as clicked movie
        response = response.filter(item => item !== id);

        // add max six movies from localstorage to array 
        response.forEach(id => {
            if (recentlyArray.length < 6) {
                recentlyArray.push(id);
            }
        });
        // add clicked movie to array 
        recentlyArray.unshift(id);
    }

    // stringify array and add to local storage 
    addLocalStorage(`recently`, JSON.stringify(recentlyArray));
}

// functions for the favorit functionality
function toggleFavorit(movie, star) {
    const movieTitle = movie[2].textContent;
    const moviePoster = movie[0].src;
    const movieId = movie[1].dataset.id;
    // get favorit movies from localstorage 
    const Response = getLocalStorage(`favorits`);
    // create an array
    let favoritsArray = [];

    // if respones is empty or not existing push id to array 
    if (Response === null || Response.length === 0) {
        const movieInformation = {
            Title: movieTitle,
            Poster: moviePoster,
            imdbID: movieId,
        };
        favoritsArray.unshift(movieInformation);
    } else {
        // add all movies from localstorage to array 
        Response.forEach(item => {
            favoritsArray.push(item);
        });
        // add clicked movies to array 
        const movieInformation = {
            Title: movieTitle,
            Poster: moviePoster,
            imdbID: movieId,
        };
        favoritsArray.unshift(movieInformation);
    }

    // set star depending on data-favorit 
    if (star.dataset.favorit === `false`) {
        star.dataset.favorit = true;
        star.src = `./icons/favorite-fill.svg`;

    } else if (star.dataset.favorit === `true`) {
        favoritsArray = favoritsArray.filter(id => id !== star.dataset.id);
        star.dataset.favorit = false;
        star.src = `./icons/favorite-outline.svg`;
    }

    // stringify array and add to local storage 
    addLocalStorage(`favorits`, JSON.stringify(favoritsArray));
}

function checkStars() {
    try {
        // get favorit movies from localstorage 
        const favorits = getLocalStorage(`favorits`);
        if (favorits !== null) {
            // select all img elements 
            const imgRef = document.querySelectorAll(`img`);

            // loop through all img and check if alt text is favorit star 
            imgRef.forEach(node => {
                if (node.alt === `Favorit Star`) {
                    // change to filled star if id is in favorit from localstorage 
                    favorits.forEach(item => {
                        if (item.imdbID.includes(node.getAttribute(`data-id`))) {
                            node.src = `./icons/favorite-fill.svg`;
                            node.dataset.favorit = true;
                        }
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

// function to render in name and year to the search options on input 
function renderSearchOptions(movie) {
    // create article for each search resault 
    const artRef = document.createElement(`article`);
    artRef.dataset.id = movie.imdbID;
    artRef.classList.add(`header__search-options`);

    // create and set movie title 
    let pRef = document.createElement(`p`);
    pRef.textContent = movie.Title;
    artRef.appendChild(pRef);

    // create and set release year 
    pRef = document.createElement(`p`);
    pRef.textContent = movie.Year;
    artRef.appendChild(pRef);

    document.querySelector(`.header__options-container`).appendChild(artRef);
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