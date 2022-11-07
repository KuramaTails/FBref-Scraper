const fetch = require('node-fetch');
let url = 'https://webws.365scores.com/web/standings/?langId=12&timezoneName=Europe/Rome&gameId=&competitions=17'
const options = {
    method: 'get',
    url: url
}

module.exports = {
    async execute() {
        fetch(url, options)
        .then(response => response.json())
        .then(json => {
        let games = json.games
        for (let i = 0; i < games.length; i++) {
            if (i== 0) {
                first = games[i].id
            }
            if (i==games.length-1) {
                last = games[i].id
            }
            h_team = games[i].homeCompetitor
            a_team = games[i].awayCompetitor
            $('#matches').append(`<%- include('../views/partials/match'); %>`);
        }
        $('#round_nr').append(`Giornata `+games[0].roundNum)
        res = json
        let temp = Object.keys(res.paging)[0]
        page = res.paging[temp]
        })
        .catch(err => console.log(err))
    }
};


