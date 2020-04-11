var mongoose = require("mongoose"),
    passportLocalMongoose= require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    created: {type: Date , default: Date.now },
<<<<<<< HEAD
    birthdate: Date

=======
    birthdate: Date,
    isAdmin: {type : Boolean , default : false}
>>>>>>> localbranch
    
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);