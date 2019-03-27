const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    text: {
        type: String
    },
    date: {
        type: Date,
        default: new Date().toLocaleDateString()
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        
    }
})

module.exports = mongoose.model(`Comment`, commentSchema)