const { default: mongoose } = require('mongoose');
const dbconnect = require('../db/dbconnect');
const matches_model = require('../models/matches_model');
const newmatch_model = require('../models/newmatch_model');

module.exports = {
    async execute(id_match,match) {
        await newmatch_model.findOneAndUpdate({
            _id: id_match,
        }, {
            $set: {
                id : id_match,
                match : match
            }
        },
        {
            upsert:true,
        })        
    }
};