// `


Vue.config.devtools = true;

const app = new Vue ({
    el : '#root',
    data : {
        mySearch : '',
        myMovies : [],
        allGenres : [],
        languages404 : ['zh','xx','ko','ur','hi','cs'],
        myPosterPath : 'https://image.tmdb.org/t/p/w342',
        wholeFocus : false,
        mySelect : 'Home',
        readyStatus : false 
        /*l'intero contenuto della root verrà montato quando questo stato passerà a true, renderizzando l'istanza alla soddisfazione della promessa (finally) di axios, permettendo di raccogliere le informazioni necessarie prima della composizione */
    },

    mounted() {
        let myApp = this;
        // Homepage
        axios
        .get('https://api.themoviedb.org/3/search/movie?api_key=9d3349e61a70c22260c6a2009d12ddf7&language=it-IT&query=best')
        .then(result => {
            result.data.results.forEach(element => {
                element.onFocus = false;
                element.actors = [];
                element.genres = [];
                this.myMovies.push(element);
                
            })
        })
        .finally(() => {
            this.myMovies.forEach(movie => {
                let myPath = 'https://api.themoviedb.org/3/movie/';
                let myResultId = movie.id;
                let myCastParam = '/credits?'
                let myApiKey = 'api_key=9d3349e61a70c22260c6a2009d12ddf7';
                let myLanguage = '&language=it-IT';
                let myCastRequest = myPath + myResultId + myCastParam + myApiKey + myLanguage;
                let myGenreRequest = myPath + myResultId + '?' + myApiKey + myLanguage;

                // Richiesta attori
                axios
                .get(myCastRequest)
                .then(result => {
                    let movieCast = result.data.cast;
                    for (let i = 0; i < 5; i++) {
                        movie.actors.push(movieCast[i].name)
                    }            
                });
                // Richiesta generi
                axios
                .get(myGenreRequest)
                .then(result => {
                    result.data.genres.forEach(element => {
                        movie.genres.push(element.name);
                    })
                })
            })
        });
        // Movie Genres
        axios
        .get('https://api.themoviedb.org/3/genre/movie/list?api_key=9d3349e61a70c22260c6a2009d12ddf7&language=it-IT')
        .then(result => {
            let foundGenres = result.data.genres;
            foundGenres.forEach(element => {
                if (!this.allGenres.includes(element.name)) {this.allGenres.push(element.name)}
            })
        });
        // TV-Series Genres
        axios
        .get('https://api.themoviedb.org/3/genre/tv/list?api_key=9d3349e61a70c22260c6a2009d12ddf7&language=it-IT')
        .then(result => {
            let tvGenres = result.data.genres;
            tvGenres.forEach(element => {
                if (!this.allGenres.includes(element.name)) {this.allGenres.push(element.name)}
            });

        })
        .finally(() => {
            myApp.readyStatus = true;

        })     
    },


    methods : {
        sendQuery() {
            let myApp = this;
            myApp.readyStatus = false;
            if (this.mySearch == '') {
                this.myMovies = [];
                myApp.readyStatus = true;
            }
            else {
                // Predisposizione fattori di ricerca
                let myApiKey = 'api_key=9d3349e61a70c22260c6a2009d12ddf7';
                let searchMovie = 'https://api.themoviedb.org/3/search/movie?';
                let searchTvSerie = 'https://api.themoviedb.org/3/search/tv?';
                let myQuery = '&query=';
                let myLanguage = '&language=it-IT'
                let searchMovieQuery = searchMovie + myApiKey + myLanguage + myQuery + this.mySearch;
                let searchTvSerieQuery = searchTvSerie + myApiKey + myLanguage + myQuery + this.mySearch;
                this.myMovies = [];
                this.mySearch = '';
                
                // Ricerca Film
                axios
                .get(searchMovieQuery)
                .then(result => {
                    result.data.results.forEach(element => {
                        element.onFocus = false;
                        element.actors = [];
                        element.genres = [];
                        this.myMovies.push(element);                                 
                    });
                });

                // Ricerca Serie TV
                axios
                .get(searchTvSerieQuery)
                .then(result => {
                    result.data.results.forEach(element => {
                        element.onFocus = false;
                        element.actors = [];
                        element.genres = [];
                        this.myMovies.push(element);
                    });
                
                })
                .finally(() => {
                    this.myMovies.forEach(movie => {
                        let myPath = 'https://api.themoviedb.org/3/movie/';
                        let myResultId = movie.id;
                        let myCastParam = '/credits?'
                        let myApiKey = 'api_key=9d3349e61a70c22260c6a2009d12ddf7';
                        let myLanguage = '&language=it-IT';
                        let myCastRequest = myPath + myResultId + myCastParam + myApiKey + myLanguage;
                        let myGenreRequest = myPath + myResultId + '?' + myApiKey + myLanguage;
                        // Ricerca Cast alla chiamata della funzione
                        axios
                        .get(myCastRequest)
                        .then(result => {
                            let movieCast = result.data.cast;
                            for (let i = 0; i < 5; i++) {
                                movie.actors.push(movieCast[i].name)
                            }            
                        });
                        // Ricerca Generi alla chiamata della funzione
                        axios
                        .get(myGenreRequest)
                        .then(result => {
                            result.data.genres.forEach(element => {
                                movie.genres.push(element.name);
                            });
                        });
                        myApp.readyStatus = true;

                    });
                });
                
            };
        }, 

        starsRating(movie) {
            let halfValue = movie.vote_average / 2;
            let myRating = Math.ceil(halfValue);
            let myRest = 5 - myRating;
            let myStars = '';

            for (let i = 0; i < myRating; i++) {
                myStars += '<i class="fas fa-star"></i>'
            }
            for (let i = 0; i < myRest; i++) {
                myStars += '<i class="far fa-star"></i>'
            }
            return myStars;
        },

        toFlag(movie) {
            let myPath = 'https://www.countryflags.io/';
            let myCountry = movie.original_language + '/';
            if (movie.original_language === 'en') {myCountry = 'gb/'};
            if (movie.original_language === 'ja') {myCountry ='jp/'};
            let myStyle = 'flat/64.png';
            let myFlag = myPath + myCountry + myStyle;
            return myFlag;
        },

        reloadPage() {
            this.mySelect = 'Home'
            location.reload()
        },

        tabFocus(movie) {
            let app = this;
            this.myMovies.forEach(element =>{
                element.onFocus = false;
                app.wholeFocus = false;
            })
            let myWait = setTimeout(function() {
                movie.onFocus = true;
                app.wholeFocus = true;
            }, 150);         
        },

        tabClose(movie) {
            let app = this;
            let myWait = setTimeout(function() {
                movie.onFocus = false
                app.wholeFocus = false;
            }, 100);
        },

        clearAll() {
            let app = this;
            app.wholeFocus = false;
            app.myMovies.forEach(movie => {
                movie.onFocus = false;
            });
        },

        contentSelection() {
            let movieArray = this.myMovies
            let selector = this.mySelect;
            if(selector == 'Home') {
                location.reload();
            }
            let tmp = [];

            movieArray.forEach(movie => {
                if (movie.genres.includes(selector)) {
                    tmp.push(movie);
                }               
            })       
            this.myMovies = tmp;
        }


    },
    
})





