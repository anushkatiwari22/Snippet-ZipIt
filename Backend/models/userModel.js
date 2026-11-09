const mongoose = require('mongoose');

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
    pfp : {
        type : String,
        default : 'https://res.cloudinary.com/irwmd8f2/image/upload/f_auto,q_auto/pfp_ht7iz3'
    },
    resumeAnalysisCount : {
        type : Number,
        default : 0
    }
} , {timestamps : true});

const userModel =  mongoose.model("userModel" , userSchema);

module.exports = userModel;