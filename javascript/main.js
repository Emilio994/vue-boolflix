// `


Vue.config.devtools = true;

const app = new Vue ({
    el : '#root',
    data : {
        mySearch : '',
        myMovies : [],
        languages404 : ['zh','xx','ko','ur','hi','cs'],
        myPosterPath : 'https://image.tmdb.org/t/p/w342',
        wholeFocus : false
    },

    mounted() {
        axios
        .get('https://api.themoviedb.org/3/search/movie?api_key=9d3349e61a70c22260c6a2009d12ddf7&language=it-IT&query=best')
        .then(result => {
            result.data.results.forEach(element => {
                element.onFocus = false;
                this.myMovies.push(element);
                console.log(element)
            })
        })

    },

    methods : {
        sendQuery() {
            if (this.mySearch == '') {
                this.myMovies = [];
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
                        this.myMovies.push(element);                                 
                    });
                });

                // Ricerca Serie TV
                axios
                .get(searchTvSerieQuery)
                .then(result => {
                    result.data.results.forEach(element => {
                        element.onFocus = false;
                        this.myMovies.push(element);
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
            }, 150)         
        },

        tabClose(movie) {
            let app = this;
            let myWait = setTimeout(function() {
                movie.onFocus = false
                app.wholeFocus = false;
            }, 100)
        }


    },
    
})





