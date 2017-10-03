var mongoose = require("mongoose");

var friendSchema = new mongoose.Schema({
    name: String,
    image: String,
    text: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Friend", friendSchema);