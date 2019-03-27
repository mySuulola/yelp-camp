const mongoose = require("mongoose");

const campgroundSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: new Date().toDateString()
  },
  author: {
    id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String
    }
  },

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
