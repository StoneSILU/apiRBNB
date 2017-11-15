const mongoose = require('mongoose')

var HomeSchema = mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, default: "59e9edbd6d9809298079fff9" },
    name: { type: String },
    numberOfTravelers: { type: Number },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    postCode: { type: String },
    surface: { type: Number },
    type: { 
        type: String,
        enum: ['Appartment', 'House', 'Loft', 'Villa'],
        default: 'Villa'
    },
    price: { type: Number },
    description: { type: String, maxLength: 200 },
    photos: [String]
})

HomeSchema.statics.searchHomeByName = function(param, callback) {
    this.find({ name: { '$regex': param } }, callback)
}

HomeSchema.statics.deleteHome = function(homeId, callback) {
    this.findByIdAndRemove(homeId, callback)
}

let Home = mongoose.model('Home', HomeSchema)

module.exports = Home