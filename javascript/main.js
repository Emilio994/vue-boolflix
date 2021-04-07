// `


Vue.config.devtools = true;

const app = new Vue ({
    el : '#root',
    data : {
        mySearch : '',
        myMovies : [],
        myLanguages : [],
        languages404 : ['ja','ko','ur','hi','cs']
    },

    methods : {
        sendQuery() {
            if (this.mySearch == '') {
                this.myMovies = [];
            }
            else {
                let myApiKey = 'api_key=9d3349e61a70c22260c6a2009d12ddf7';
                let searchMovie = 'https://api.themoviedb.org/3/search/movie?';
                let searchTvSerie = 'https://api.themoviedb.org/3/search/tv?';
                let myQuery = '&query=';
                let myLanguage = '&language=it-IT'
                let searchMovieQuery = searchMovie + myApiKey + myLanguage + myQuery + this.mySearch;
                let searchTvSerieQuery = searchTvSerie + myApiKey + myLanguage + myQuery + this.mySearch;
                this.myMovies = [];
                this.mySearch = '';
                this.myLanguages = [];
                
                // Ricerca Film
                axios
                .get(searchMovieQuery)
                .then(result => {
                    result.data.results.forEach(element => {
                        this.myMovies.push(element);
                        if (!this.myLanguages.includes(element.original_language)) {
                            this.myLanguages.push(element.original_language)
                        };                                    
                    });
                });
                // Ricerca Serie TV
                axios
                .get(searchTvSerieQuery)
                .then(result => {
                    result.data.results.forEach(element => {
                        this.myMovies.push(element);
                        if (!this.myLanguages.includes(element.original_language)) {
                            this.myLanguages.push(element.original_language)
                        };
                    })
                    console.log(result);
                })             
            }
        },              
        clearAll() {
            this.mySearch = '';
            this.myMovies = [];
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
            let myStyle = 'flat/64.png';
            let myFlag = myPath + myCountry + myStyle;
            return myFlag;
        },
    },
    
})





