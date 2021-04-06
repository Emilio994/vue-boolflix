// `


Vue.config.devtools = true;

const app = new Vue ({
    el : '#root',
    data : {
        mySearch : '',
    },
    methods : {
        sendQuery() {
            let myApiKey = 'api_key=9d3349e61a70c22260c6a2009d12ddf7';
            let searchPath = 'https://api.themoviedb.org/3/search/movie?api_key=9d3349e61a70c22260c6a2009d12ddf7&query=';
            let myQuery = '&query=';
            let myLanguage = '&language=it-IT'
            let searchQuery = searchPath + myApiKey + myLanguage + myQuery + this.mySearch;
            console.log(searchQuery);
            axios.
            get(searchPath + this.mySearch).
            then(result => {
                console.log(result);
            })
        }
        
    }
})





