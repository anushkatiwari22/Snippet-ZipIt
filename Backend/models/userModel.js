const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : {
        type : String ,
        required : true 
    },
    email : {
        type : String ,
        required : true
    },
    password : {
        type : password ,
        required : true
    }
} , {timeStamps : true});

const userModel = new mongoose.model("userModel" , userSchema);

module.exports = userModel;