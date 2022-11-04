const express = require('express');
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');

//https://webws.365scores.com/web/game/?langId=12&timezoneName=Europe/Rome&gameId=3581564
//https://webws.365scores.com/web/games/?langId=12&timezoneId=4&competitors=293&aftergame=3581601&direction=1
//https://webws.365scores.com/web/games/current/?langId=12&timezoneName=Europe/Rome&competitions=17
//https://webws.365scores.com/web/games/results/?langId=12&timezoneName=Europe/Rome&competitions=17
//https://webws.365scores.com/web/games/results/?langId=12&timezoneId=4&competitors=293
let url = 'https://webws.365scores.com/web/games/results/?langId=12&timezoneName=Europe/Rome&competitions=17'
let options = {method: 'GET'};
let cache
let nextPage
let z = 1

router.get('/', function(request, response) {
	response.redirect('/notes')
});

router.get('/notes', function(request, response) {
    response.render(path.join(__dirname + '../../public/main.ejs'));
});

router.post('/back', function(request, response) {
    z--
    console.log(cache.length)
    if (z<0) {
        fetch("https://webws.365scores.com/"+nextPage, options)
        .then(res => res.json())
        .then(json => {
            cache = json.games
            json.games.slice(0,10)
            response.send(json.games)
        })
        z=0
    }
    else {
        response.send(cache.slice(11,20))
    }
});

router.post('/next', function(request, response) {
    z++
    if (z>1) {
        fetch("https://webws.365scores.com/"+nextPage, options)
        .then(res => res.json())
        .then(json => {
            cache = json.games
            json.games.slice(0,10)
            response.send(json.games)
        })
        z=0
    }
    else {
        response.send(cache.slice(0,10))
    }
});


router.post('/getstats', function(request, response) {
    if (request.body.id) {
        let id = request.body.id
        let url = 'https://webws.365scores.com/web/game/?langId=12&timezoneName=Europe/Rome&gameId='+id
        fetch(url, options)
        .then(res => res.json())
        .then(json => {
            let game = json.game
            response.send(game)
        })
    }
});

module.exports = router;