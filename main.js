const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path');
const indexRoutes = require('./router/router_main.js');
const dotenv = require('dotenv');
const updateCompetition = require('./fetch/updateCompetition.js');
const { default: fetch } = require('node-fetch');
const app = express();


var server = app.listen(3000);
var io = require('socket.io')(server);


dotenv.config()

app.use(sessions({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRoutes);
app.use('/notes', indexRoutes);
app.use('/loadnotes', indexRoutes);
app.use('/back', indexRoutes);
app.use('/next', indexRoutes);
app.use('/getstats', indexRoutes);

let ids = {
    "Udinese" : {
        "id": 229,
        "countryId": 3,
        "name": "Udinese",
        "longName": "Udinese Calcio",
        "symbolicName": "UDI",
        "nameForURL": "udinese",
        "color": "#000000",
        "mainCompetitionId": 17,
    },
    'Lecce' : {
        "id": 246,
        "countryId": 3,
        "name": "Lecce",
        "symbolicName": "LEC",
        "nameForURL": "lecce",
        "color": "#F2F200",
        "mainCompetitionId": 17,
    },
    'Empoli' : {
        "id": 237,
        "countryId": 3,
        "name": "Empoli",
        "symbolicName": "EMP",
        "nameForURL": "empoli",
        "color": "#146BBB",
        "mainCompetitionId": 17,
    },
    'Sassuolo' : {
        "id": 266,
        "countryId": 3,
        "name": "Sassuolo",
        "longName": "Sassuolo Calcio",
        "symbolicName": "SAS",
        "nameForURL": "sassuolo",
        "color": "#006600",
        "mainCompetitionId": 17,
    },
    'Salernitana' : {
        "id": 268,
        "countryId": 3,
        "name": "Salernitana",
        "symbolicName": "SAL",
        "nameForURL": "salernitana",
        "color": "#993333",
        "mainCompetitionId": 17,
    },
    'Cremonese' :{
        "id": 290,
        "countryId": 3,
        "name": "Cremonese",
        "symbolicName": "CRE",
        "nameForURL": "cremonese",
        "color": "#CC0000",
        "mainCompetitionId": 17,
    },
    'Atalanta' : {
        "id": 232,
        "countryId": 3,
        "name": "Atalanta",
        "longName": "Atalanta Bergamo",
        "symbolicName": "ATA",
        "nameForURL": "atalanta",
        "color": "#0063C6",
        "mainCompetitionId": 17,
    },
    'Napoli' : {
        "id": 234,
        "countryId": 3,
        "name": "Napoli",
        "symbolicName": "NAP",
        "nameForURL": "napoli",
        "color": "#008CEA",
        "mainCompetitionId": 17,
    },
    'Milan':{
        "id": 227,
        "countryId": 3,
        "name": "AC Milan",
        "symbolicName": "ACM",
        "nameForURL": "ac-milan",
        "color": "#DB080A",
        "mainCompetitionId": 17,
    },
    'Spezia':{
        "id": 263,
        "countryId": 3,
        "sportId": 1,
        "name": "Spezia",
        "symbolicName": "SPE",
        "nameForURL": "spezia",
        "type": 1,
        "popularityRank": 703065,
        "imageVersion": 2,
        "color": "#D9D9D9",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Bologna':{
        "id": 245,
        "countryId": 3,
        "sportId": 1,
        "name": "Bologna",
        "symbolicName": "BOL",
        "nameForURL": "bologna",
        "type": 1,
        "popularityRank": 1890868,
        "imageVersion": 1,
        "color": "#CC0000",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Torino':{
        "id": 235,
        "countryId": 3,
        "sportId": 1,
        "name": "Torino",
        "symbolicName": "TOR",
        "nameForURL": "torino",
        "type": 1,
        "popularityRank": 2509427,
        "imageVersion": 2,
        "color": "#660000",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Sampdoria':{
        "id": 230,
        "countryId": 3,
        "sportId": 1,
        "name": "Sampdoria",
        "symbolicName": "SAM",
        "nameForURL": "sampdoria",
        "type": 1,
        "popularityRank": 2451723,
        "imageVersion": 2,
        "color": "#223199",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Fiorentina':{
        "id": 228,
        "countryId": 3,
        "sportId": 1,
        "name": "Fiorentina",
        "symbolicName": "FIO",
        "nameForURL": "fiorentina",
        "type": 1,
        "popularityRank": 5909613,
        "imageVersion": 2,
        "color": "#572D88",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Monza':{
        "id": 293,
        "countryId": 3,
        "sportId": 1,
        "name": "Monza",
        "symbolicName": "MON",
        "nameForURL": "monza",
        "type": 1,
        "popularityRank": 205264,
        "imageVersion": 2,
        "color": "#FF0000",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Hellas Verona':{
        "id": 316,
        "countryId": 3,
        "sportId": 1,
        "name": "Hellas Verona",
        "symbolicName": "VER",
        "nameForURL": "hellas-verona",
        "type": 1,
        "popularityRank": 1683072,
        "imageVersion": 3,
        "color": "#E8D800",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Roma':{
        "id": 225,
        "countryId": 3,
        "sportId": 1,
        "name": "Roma",
        "symbolicName": "ROM",
        "nameForURL": "as-roma",
        "type": 1,
        "popularityRank": 15503626,
        "imageVersion": 5,
        "color": "#AA0000",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Lazio':{
        "id": 236,
        "countryId": 3,
        "sportId": 1,
        "name": "Lazio",
        "symbolicName": "LAZ",
        "nameForURL": "lazio",
        "type": 1,
        "popularityRank": 5291344,
        "imageVersion": 1,
        "color": "#55AFDE",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Juventus':{
        "id": 226,
        "countryId": 3,
        "sportId": 1,
        "name": "Juventus",
        "symbolicName": "JUV",
        "nameForURL": "juventus",
        "type": 1,
        "popularityRank": 28762103,
        "imageVersion": 26,
        "color": "#000000",
        "mainCompetitionId": 17,
        "hasSquad": true
    },
    'Inter':{
        "id": 224,
        "countryId": 3,
        "sportId": 1,
        "name": "Inter",
        "symbolicName": "INT",
        "nameForURL": "inter-milan",
        "type": 1,
        "popularityRank": 19246779,
        "imageVersion": 3,
        "color": "#00409B",
        "mainCompetitionId": 17,
        "hasSquad": true
    }
}

io.on('connection', async(socket) => {
    console.log('a user connected');
    let url = socket.handshake.headers.referer.split('/')
    switch (url[url.length-1]) {
        case 'notes':
            //https://api.sofascore.com/api/v1/unique-tournament/17/season/41886/events/round/2
            //https://webws.365scores.com/web/games/current/?langId=12&timezoneName=Europe/Rome&competitions=17
            //https://www.fotmob.com/api/matches?timezone=Europe/Rome

            async function update() {
                fetch('https://www.fotmob.com/api/leagues?id=55&timezone=Europe/Rome', {method: 'get'})
                .then(response => response.json())
                .then(round => {
                    fetch('https://webws.365scores.com/web/games/current/?langId=12&timezoneName=Europe/Rome&competitions=17', {method: 'get'})
                    .then(response => response.json())
                    .then(live_matches => {
                        let live = {}
                        let data = { round , ids , live}
                        live_matches.games.forEach(match => {
                            if (match.gameTimeDisplay != '') {
                                data.live[String(match.homeCompetitor.id)+'-'+String(match.awayCompetitor.id)+'-17'] = match
                            }
                        });
                        socket.emit("update", data);
                    })
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
            }
            async function check() {
                fetch('https://webws.365scores.com/web/games/current/?langId=12&timezoneName=Europe/Rome&competitions=17', {method: 'get'})
                .then(response => response.json())
                .then(json => {
                    let live = {}
                    json.games.forEach(match => {
                        if (match.gameTimeDisplay != '') {
                            live[String(match.homeCompetitor.id)+'-'+String(match.awayCompetitor.id)+'-17'] = match
                        }
                    });
                    if (Object.keys(live).length>0) {
                        socket.emit("check", live);
                    }
                })
                .catch(err => console.log(err))
            }

            await update()
            setInterval(() => {
                check()
            }, 60*1000);
            break;
    }

    socket.on("getStats", (match_id) => {
                    //'https://www.fotmob.com/api/matchDetails?matchId='+match_id+'&timezone=Europe/Rome'
                    let url = 'https://webws.365scores.com/web/game/?langId=12&timezoneName=Europe/Rome&matchupId='+match_id
                    const options = {
                        method: 'get',
                        url: url
                    }
                    async function stats(url,options) {
                        fetch(url, options)
                        .then(response => response.json())
                        .then(json => {
                            socket.emit('stats',json)
                        })
                        .catch(err => console.log(err))
                    }
                    stats(url,options)
      });


    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });

/*
updateCompetition.execute();

setInterval(() => {
    updateCompetition.execute();
}, 60*60*1000);*/
