const mongoose = require('mongoose');
//const questionsModel = require('../models/questionsModel');

const userSchema = mongoose.Schema({
    username : {
        type : String ,
        required : true,
        unique : true
    },
    email : {
        type : String ,
        required : true
    },
    password : {
        type : String ,
        required : true
    }
} , {timeStamps : true});

const userModel = new mongoose.model("userModel" , userSchema);

module.exports = userModel;