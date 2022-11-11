const mongoose = require ('mongoose')
const reqString = {
    type: String,
    required: true,
}
const reqMap = {
    type: Map,
    required: true,
}
const matchesSchema = mongoose.Schema({
    _id:reqString,
    match : reqMap,
})

module.exports = mongoose.model('new_match' , matchesSchema)