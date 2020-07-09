var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var ChatSchema = new mongoose.Schema({
    username: String,
    chat:String
 
});

ChatSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Chat", ChatSchema);