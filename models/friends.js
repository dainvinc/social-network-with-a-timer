var mongoose = require("mongoose");

var friendSchema = new mongoose.Schema({
    name: String,
    image: String,
    text: String,
    created: {type: Date, default: Date.now},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Friend", friendSchema);