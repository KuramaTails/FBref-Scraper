const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path');
const indexRoutes = require('./router/router_main.js');
const dotenv = require('dotenv');
const updateMatches = require('./fetch/updateMatches.js');
const { default: fetch } = require('node-fetch');
const dbconnect = require('./db/dbconnect.js');
const dbdisconnect = require('./db/dbdisconnect.js');
const { default: mongoose } = require('mongoose');
const matches_model = require('./models/matches_model.js');
const newmatch_model = require('./models/newmatch_model.js');
const app = express();

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

let matches

async function fetchAll() {
    //https://www.fotmob.com/api/teams?id=8634&timezone=Europe/Rome&ccode3=ITA
    //https://www.fotmob.com/api/tltable?leagueId=55&timezone=Europe/Rome
    /*await dbconnect();
    console.log('Fetching played Matches in db')
    const count_playedMatches = await newmatch_model.aggregate([{ $match: {'match.header.status.finished': true}}])
    await dbdisconnect();
    let url = 'https://www.fotmob.com/api/leagues?id=55&timezone=Europe/Rome'
    fetch(url, {method: 'get'})
        .then(response => response.json())
        .then(async json => {
            let matches = json.matches.data.allMatches
            let first_unplayedMatch = json.matches.firstUnplayedMatch.firstUnplayedMatchIndex
            if (count_playedMatches.length != first_unplayedMatch) {
                console.log('Db matches are different from APIs matches')
                await dbconnect();
                for (let i = 0; i < matches.length; i++) {
                    let id = matches[i].id
                    let url = 'https://www.fotmob.com/api/matchDetails?matchId='+id+'&timezone=Europe/Rome'
                    await fetch(url, {method: 'get'})
                    .then(response => response.json())
                    .then(async json => {
                        let id_match = json.general.matchId
                        let match = {content:json.content, general:json.general, header:json.header}
                        await updateMatches.execute(id_match,match)
                    })
                    .catch(err => console.log(err));
                }
                await dbdisconnect();
            }
        })
        .catch(err => console.log(err))*/

        await dbconnect();
        let fixtures = await newmatch_model.find({})
        await dbdisconnect();
        //matches.find(x => x._id == '3919179')
        //matches.slice(0,10)

        var server = app.listen(3000);
        var io = require('socket.io')(server);

        console.log('Server started!')
        io.on('connection', async(socket) => {
            console.log('a user connected');
            let url = socket.handshake.headers.referer.split('/')
            switch (url[url.length-1]) {
                case 'notes':
                    if (!matches) {
                        fetch('https://www.fotmob.com/api/leagues?id=55&timezone=Europe/Rome', {method: 'get'})
                        .then(response => response.json())
                        .then(async round => {
                            matches = round
                            socket.emit("update", {round,ids});
                        })
                        .catch(err => console.log(err))
                    } else {
                        round = matches
                        socket.emit("update", {round,ids});
                    }
            }
        
            /*socket.on("getStats", async (match_id) => {
                await fetch('https://www.fotmob.com/api/matchDetails?matchId='+match_id+'&timezone=Europe/Rome', {method: 'get'})
                .then(response => response.json())
                .then(async json => {
                    if (json.header.status.reason) {
                        socket.emit('stats',json)
                    }
                    else {
                        let teams = { 'away' : {id:json.header.teams[0].id,matches:[],stats:{}}, 'home': {id:json.header.teams[1].id,matches:[],stats:{}}}
                        for(let i = 0; i < Object.keys(teams).length; i++) {
                            await fetch('https://www.fotmob.com/api/teams?id='+teams[Object.keys(teams)[i]].id+'&timezone=Europe/Rome&ccode3=ITA', {method: 'get'})
                            .then(response => response.json())
                            .then(teamjson => {
                                let fixtures = teamjson.fixtures.allFixtures.fixtures
                                fixtures.forEach(match => {
                                    if (match.tournament.name == 'Serie A' && match.status.finished == true && match[Object.keys(teams)[i]].id == teams[Object.keys(teams)[i]].id ) {
                                        teams[Object.keys(teams)[i]].matches.push(match.id)
                                    }
                                });
                            })
                            .catch(err => console.log(err))
                        }
                        for(let i = 0; i < Object.keys(teams).length; i++) {
                            for(let x = 0; x < teams[Object.keys(teams)[i]].matches.length; x++) {
                                await fetch('https://www.fotmob.com/api/matchDetails?matchId='+teams[Object.keys(teams)[i]].matches[x]+'&timezone=Europe/Rome', {method: 'get'})
                                .then(response => response.json())
                                .then(json => {
                                    if (Object.keys(teams[Object.keys(teams)[i]].stats).length<1) {
                                        teams[Object.keys(teams)[i]].stats = json.content.stats.stats
                                    } else {
                                        for (let y = 0; y < teams[Object.keys(teams)[i]].stats.length; y++) {
                                            for (let z = 0; z < teams[Object.keys(teams)[i]].stats[y].stats.length; z++) {
                                                if (json.content.stats.stats[y].stats) {
                                                    if (json.content.stats.stats[y].stats[z]) {
                                                        json.content.stats.stats[y].stats[z].stats.forEach(value => {
                                                            teams[Object.keys(teams)[i]].stats[y].stats[z].stats.push(value)
                                                        });
                                                    }
                                                }
                                                else {
                                                    teams[Object.keys(teams)[i]].stats[y].stats[z].stats.push(0,0)
                                                }
                                                if (x == teams[Object.keys(teams)[i]].matches.length-1) {
                                                    const havg = []
                                                    const aavg = []
                                                    for (let index = 0; index < teams[Object.keys(teams)[i]].stats[y].stats[z].stats.length; index++) {
                                                        
                                                        if (index % 2 == 0) {
                                                            havg.push(teams[Object.keys(teams)[i]].stats[y].stats[z].stats[index])
                                                        } else {
                                                            aavg.push(teams[Object.keys(teams)[i]].stats[y].stats[z].stats[index])
                                                        }                                                        
                                                    }
                                                    const hsum = havg.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
                                                    const h_avg = parseFloat(hsum / havg.length).toFixed(2) || 0;
                                                    const asum = aavg.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
                                                    const a_avg = parseFloat(asum / aavg.length).toFixed(2) || 0;
                                                    teams[Object.keys(teams)[i]].stats[y].stats[z].stats = [h_avg,a_avg]
                                                }
                                            }                                            
                                        }
                                    }
                                    
                                })
                                .catch(err => console.log(err))
                            }
                        }
                        json.avgStats = teams
                        socket.emit('stats',json)
                    }
                })
                .catch(err => console.log(err))
            });*/
            socket.on("getStats", async (round) => {
                const currentMatches = []
                fixtures.filter(x=> x.match.get('general').matchRound == round? currentMatches.push(x) : '')
                socket.emit('returnStats',currentMatches)
            })

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
          });
}


fetchAll()







/*
updateCompetition.execute();

setInterval(() => {
    updateCompetition.execute();
}, 60*60*1000);*/
