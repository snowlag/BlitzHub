var mongoose = require("mongoose"),
    passportLocalMongoose= require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    created: {type: Date , default: Date.now },
    birthdate: Date,
    isAdmin: {type : Boolean , default : false}
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);