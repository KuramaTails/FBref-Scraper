const mongoose = require ('mongoose')
const reqString = {
    type: String,
    required: true,
}
const reqArray = {
    type: Array,
    required: true,
}
const averageSchema = mongoose.Schema({
    _id:reqString,
    stats:reqArray, 
})

module.exports = mongoose.model('average' , averageSchema)