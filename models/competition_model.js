const mongoose = require ('mongoose')
const reqString = {
    type: String,
    required: true,
}
const reqMap = {
    type: Map,
    required: true,
}
const competitionSchema = mongoose.Schema({
    _id:reqString,
    competition:reqMap, 
})

module.exports = mongoose.model('competition' , competitionSchema)