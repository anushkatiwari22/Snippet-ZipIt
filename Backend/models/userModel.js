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
    },
    resumeAnalysisCount : {
        type : Number,
        default : 0
    }
} , {timestamps : true});

const userModel = new mongoose.model("userModel" , userSchema);

module.exports = userModel;