const mongoose = require('mongoose');

const aireviewSchema = new mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    } ,
    review : {
        type  : mongoose.Schema.Types.Mixed ,
    }
} , {timestamps : true});

const aireviewModel =  mongoose.model("aireviewModel" , aireviewSchema);

module.exports = aireviewModel ;