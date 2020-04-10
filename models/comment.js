var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    created: {type: Date , default: Date.now },
    rating:  Number,
    author: {
        id:  {type: mongoose.Schema.ObjectId,
              ref: "User"
             },
        username: String

    }
});
 
module.exports = mongoose.model("Comment", commentSchema);
