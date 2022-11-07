const mongoose = require ('mongoose')
const reqString = {
    type: String,
    required: true,
}
const reqMap = {
    type: Map,
    required: true,
}
const standingSchema = mongoose.Schema({
    id:reqString,
    competition:reqMap, 
})

module.exports = mongoose.model('standing' , standingSchema)