const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path');
const indexRoutes = require('./router/router_main.js');
const dotenv = require('dotenv');
const { default: fetch } = require('node-fetch');
const dbconnect = require('./db/dbconnect.js');
const dbdisconnect = require('./db/dbdisconnect.js');
const newmatch_model = require('./models/newmatch_model.js');
const competition_model = require('./models/competition_model.js');
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
const fs = require('fs');
const updateMatches = require('./fetch/updateMatches.js');
const createAvgsStats = require('./fetch/createAvgsStats.js');
const avg_model = require('./models/avg_model.js');


let matches
let fixtures
let competition
let avgs
async function retrieve_fixtures() {
    await fetch('https://www.fotmob.com/api/leagues?id=55&timezone=Europe/Rome', {method: 'get'})
    .then(response => response.json())
    .then(async league => {
        await dbconnect()
        let dbLeague = await competition_model.find({_id:'55'})
        if (dbLeague[0].competition.get('matches').firstUnplayedMatch.firstUnplayedMatchIndex != league.matches.firstUnplayedMatch.firstUnplayedMatchIndex) {
            let oldIndex = dbLeague[0].competition.get('matches').firstUnplayedMatch.firstUnplayedMatchIndex
            delete league.tabs
            delete league.details.faqJSONLD
            delete league.seostr
            delete league.QAData 
            delete league.transfers
            delete league.news
            delete league.overview
            await competition_model.findOneAndUpdate({
                _id: league.details.id,
            }, {
                $set: {
                    id: league.details.id,
                    competition: league
                }
            },
            {
                upsert:true,
            })
            competition = league
            matches = league.matches.data.allMatches

            for (let i = oldIndex; i < matches.length; i++) {
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
            await createAvgsStats.execute(matches)
        } else {
            competition = dbLeague[0].competition
            matches = dbLeague[0].competition.get('matches').data.allMatches
            fixtures = await newmatch_model.find({})
            let avg_fetch = await avg_model.find({_id:'55'})
            avgs = avg_fetch[0]
        }
        await dbdisconnect();
    })
    .catch(err => console.log(err))
}

retrieve_fixtures().then(() => {
    var server = app.listen(3000);
    var io = require('socket.io')(server);
    console.log('Server started!')

    io.on('connection', async(socket) => {
        console.log('a user connected');
        let url = socket.handshake.headers.referer.split('/')
        switch (url[url.length-1]) {
            case 'notes':
                let currRound = competition.get('matches').firstUnplayedMatch.firstRoundWithUnplayedMatch
                socket.emit("update", {currRound,matches});
        }

        socket.on("getStats", async (round) => {
            const currentPageMatches = []
            fixtures.filter(x=> x.match.get('general').matchRound == round? currentPageMatches.push(x) : '')
            socket.emit('returnStats',currentPageMatches)
        })
        
        socket.on("getAvgStats", async (match) => {
            let h_team = {name:match.general.homeTeam.name}
            let a_team = {name:match.general.awayTeam.name}
            h_team['avg'] = avgs.stats[0][h_team.name]
            a_team['avg'] = avgs.stats[1][a_team.name]
            socket.emit('returnAvgStats',{match,h_team,a_team})
        })
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
})



