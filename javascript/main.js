// `


Vue.config.devtools = true;

const app = new Vue ({
    el : '#root',
    data : {
        mySearch : '',
        myMovies : []
    },

    methods : {
        sendQuery() {
            if (this.mySearch == '') {
                this.myMovies = [];
            }
            else {
                let myApiKey = 'api_key=9d3349e61a70c22260c6a2009d12ddf7';
                let searchPath = 'https://api.themoviedb.org/3/search/movie?api_key=9d3349e61a70c22260c6a2009d12ddf7&query=';
                let myQuery = '&query=';
                let myLanguage = '&language=it-IT'
                let searchQuery = searchPath + myApiKey + myLanguage + myQuery + this.mySearch;
                axios.
                get(searchQuery)
                .then(result => {
                console.log(result);
                this.myMovies = [];
                this.mySearch = '';
                result.data.results.forEach(element => {
                    this.myMovies.push(element);                    
                });
                console.log(this.myMovies);                
                });
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
        }     
    },
    
})





