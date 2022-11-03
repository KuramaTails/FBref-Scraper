'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch');
const date = new Date().toISOString() .split("T")[0].replaceAll('-','');
let url = 'https://site.api.espn.com/apis/site/v2/sports/soccer/scorepanel?lang=en&region=us&calendartype=ondays&limit=100&showAirings=true&dates='+date+'&tz=America/New_York'
let options = {method: 'GET'};

var xlsx = require('xlsx');
var df = xlsx.readFile('./dfs/df_sum.xlsx');
var dfh = xlsx.readFile('./dfs/df_home.xlsx');
var dfa = xlsx.readFile('./dfs/df_away.xlsx');
var fixtures = xlsx.utils.sheet_to_json(df.Sheets[df.SheetNames[0]])
var start_empty = 0
for (let row = 0; row < fixtures.length; row++) {
    if (fixtures[row]['Goals'] == '' && fixtures[row]['Passaggi Totali'] == '') {
        start_empty =row
        break
    }    
}
var home_stats = xlsx.utils.sheet_to_json(dfh.Sheets[dfh.SheetNames[0]])
var away_stats = xlsx.utils.sheet_to_json(dfa.Sheets[dfa.SheetNames[0]])

router.get('/', function(request, response) {
	response.redirect('/notes')
});

router.get('/notes', function(request, response) {
    fetch(url, options)
    .then(res => res.json())
    .then(json => {
        let res = json.scores
        if (res) {
            res.forEach(league => {
                if (league.leagues[0].name == 'Italian Serie A') {
                    console.log(league)
                }
            });
        }
    })
    .catch(err => console.error('error:' + err));
    
    response.render(path.join(__dirname + '../../public/main.ejs'));
});

router.get('/loadnotes', function(request, response) {
    let data = ''
    if(request.query.giornata) {
        let start_row = parseInt(request.query.giornata)
        data = fixtures.slice(start_row,start_row+20);
    }
    else {
        data = fixtures.slice(start_empty-20,start_empty);
    }
	response.send(data)
});

router.post('/back', function(request, response) {
    let start_row = 20*(parseInt(request.body.Giornata)-2)
    response.redirect('/loadnotes?giornata='+start_row)
});

router.post('/next', function(request, response) {
    let start_row = 20*(parseInt(request.body.Giornata))
    response.redirect('/loadnotes?giornata='+start_row)
});


router.post('/getstats', function(request, response) {
    let start_row = parseInt(request.body.id)
    let data = fixtures.slice(start_row,start_row+2);
    if (data[0]['Goals'] == '' && data[0]['Passaggi Totali'] == '') {
        var stats = []
        home_stats.forEach(team => {
            if (team.Squadra == data[0].Squadra) {
                stats.push(team)
            }
        });
        away_stats.forEach(team => {
            if (team.Squadra == data[1].Squadra) {
                stats.push(team)
            }
        });

        return response.send(stats)
    }
	response.send(data)
});

module.exports = router;