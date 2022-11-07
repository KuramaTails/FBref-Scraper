const mongoose = require ('mongoose')
const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
}
const reqMap = {
    type: Map,
    required: true,
}
const competitionSchema = mongoose.Schema({
    _id:reqString,
    lastUpdateId:reqNumber,
    competition:reqMap, 
})

module.exports = mongoose.model('competition' , competitionSchema)