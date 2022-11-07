const fetch = require('node-fetch');
const dbconnect = require('../db/dbconnect');
const dbdisconnect = require('../db/dbdisconnect');
const competition_model = require('../models/competition_model');
let url = 'https://webws.365scores.com/web/standings/?langId=12&timezoneName=Europe/Rome&gameId=&competitions=17'
const options = {
    method: 'get',
    url: url
}

module.exports = {
    async execute() {
        fetch(url, options)
        .then(response => response.json())
        .then(async json => {
            id = json.competitions[0].id
            lastUpdateId = json.lastUpdateId
            delete json.bookmakers
            delete json.countries
            delete json.requestedUpdateId
            delete json.sports
            delete json.ttl
            delete json.lastUpdateId
            delete json.competitions[0]['id']
            await dbconnect()
            const competition = await competition_model.findById(id)
            if (competition.lastUpdateId != json.lastUpdateId) {
                await competition_model.findOneAndUpdate({
                    _id: id,
                }, {
                    $set: {
                        id: json.competitions[0].id,
                        lastUpdateId : json.lastUpdateId,
                        competition: json
                    }
                },
                {
                    upsert:true,
                })
            }
            await dbdisconnect();
        })
        .catch(err => console.log(err))
    }
};