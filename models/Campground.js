const mongoose = require('mongoose')

const campgroundSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }, 
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
})

module.exports = mongoose.model("Campground", campgroundSchema)