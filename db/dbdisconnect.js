const mongoose = require('mongoose')
module.exports = async () => {
    await mongoose.connection.close()
    console.log("Disconnected from database")
}
