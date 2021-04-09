// `


Vue.config.devtools = true;

const app = new Vue ({
    el : '#root',
    data : {
        mySearch : '',
        myResults : [],
        allGenres : [],
        languages404 : ['zh','xx','ko','ur','hi','cs'],
        myPosterPath : 'https://image.tmdb.org/t/p/w342',
        wholeFocus : false,
        mySelect : 'None',
        requestsIndex : []
    },

    mounted() {
        // Movie Genres (tutti i generi disponibili)
        axios
        .get('https://api.themoviedb.org/3/genre/movie/list?api_key=9d3349e61a70c22260c6a2009d12ddf7&language=it-IT')
        .then(result => {
            let foundGenres = result.data.genres;
            foundGenres.forEach(element => {
                if (!this.allGenres.includes(element.name)) {this.allGenres.push(element.name)}
            });
        });

        // TV-Series Genres (tutti i generi disponibili)
        axios
        .get('https://api.themoviedb.org/3/genre/tv/list?api_key=9d3349e61a70c22260c6a2009d12ddf7&language=it-IT')
        .then(result => {
            let tvGenres = result.data.genres;
            tvGenres.forEach(element => {
                if (!this.allGenres.includes(element.name)) {this.allGenres.push(element.name)}
            });
        });

        // Homepage
        axios
        .get('https://api.themoviedb.org/3/movie/popular?api_key=9d3349e61a70c22260c6a2009d12ddf7&language=it-IT')
        .then(result => {
            result.data.results.forEach(element => {
                element.onFocus = false;
                element.actors = [];
                element.genres = [];
                this.myResults.push(element);
            });
        })
        .finally(() => {
            this.myResults.forEach(movie => {
                let myPath = 'https://api.themoviedb.org/3/movie/';
                let myResultId = movie.id;
                let myCastParam = '/credits?'
                let myApiKey = 'api_key=9d3349e61a70c22260c6a2009d12ddf7';
                let myLanguage = '&language=it-IT';
                let myCastRequest = myPath + myResultId + myCastParam + myApiKey + myLanguage;
                let myGenreRequest = myPath + myResultId + '?' + myApiKey + myLanguage;

                // Richiesta attori (dei miei risultati)
                axios
                .get(myCastRequest)
                .then(result => {
                    let movieCast = result.data.cast;
                    if (movieCast.length > 0) {
                        for (let i = 0; i < 5 && i < movieCast.length; i++) {
                            movie.actors.push(movieCast[i].name)
                        };    
                    };   
                });
                // Richiesta generi (dei miei risultati)
                axios
                .get(myGenreRequest)
                .then(result => {
                    result.data.genres.forEach(element => {
                        if (result.data.genres.length > 0) {
                            movie.genres.push(element.name);
                        };                        
                    });
                });
            });
        });
    },


    methods : {
        sendQuery() {
            this.mySelect = 'None';
            this.requestsIndex = [];
            this.requestsIndex.push(this.mySearch);
            if (this.mySearch == '') {
                this.myResults = [];
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
                this.myResults = [];
                this.mySearch = '';
                
                // Ricerca Film
                axios
                .get(searchMovieQuery)
                .then(result => {
                    result.data.results.forEach(element => {
                        element.onFocus = false;
                        element.actors = [];
                        element.genres = [];
                        this.myResults.push(element);                                 
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
                        this.myResults.push(element);
                    });
                })
                .finally(() => {
                    this.myResults.forEach(movie => {
                        let myPath = 'https://api.themoviedb.org/3/movie/';
                        let myResultId = movie.id;
                        let myCastParam = '/credits?'
                        let myApiKey = 'api_key=9d3349e61a70c22260c6a2009d12ddf7';
                        let myLanguage = '&language=it-IT';
                        let myCastRequest = myPath + myResultId + myCastParam + myApiKey + myLanguage;
                        let myGenreRequest = myPath + myResultId + '?' + myApiKey + myLanguage;

                        // Ricerca Cast dei risultati alla chiamata della funzione
                        axios
                        .get(myCastRequest)
                        .then(result => {
                            let movieCast = result.data.cast;
                            if (movieCast.length > 0) {
                                for (let i = 0; i < 5 && i < movieCast.length; i++) {
                                    movie.actors.push(movieCast[i].name)
                                };    
                            };        
                        });

                        // Ricerca Generi dei risultati alla chiamata della funzione
                        axios
                        .get(myGenreRequest)
                        .then(result => {
                            result.data.genres.forEach(element => {
                                if (result.data.genres.length > 0) {
                                    movie.genres.push(element.name);
                                };                                
                            });
                        });
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
            };
            for (let i = 0; i < myRest; i++) {
                myStars += '<i class="far fa-star"></i>'
            };
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
            this.mySelect = 'None';
            location.reload();
        },

        tabFocus(movie) {
            let app = this;
            this.myResults.forEach(element =>{
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
            app.myResults.forEach(movie => {
                movie.onFocus = false;
            });
        },

        contentSelection() {
            let movieArray = this.myResults
            let selector = this.mySelect;
            if(selector == 'None') {
                location.reload();
            };
            let tmp = [];

            movieArray.forEach(movie => {
                if (movie.genres.includes(selector)) {
                    tmp.push(movie);
                } ;              
            });     
            this.myResults = tmp;
        }
    }
})





