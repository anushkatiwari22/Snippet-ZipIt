const mongoose = require("mongoose");
const userModel = require("./userModel");
const { required } = require("joi");
const progressSchema = new mongoose.Schema({
    userid :{
        type : mongoose.Schema.Types.ObjectId  ,
        ref : "userModel" ,
        required : true
    } ,
    currentweek : {
        type : String ,
    } ,
    progress : [{
        week : {
            type : String ,
        } ,
        completedTasks : {
            type : [String] ,
            default : []
        } ,
        completed : {
            type : Boolean ,
            default : false 
        } ,
        quizScore : {
            type : Number ,
            default :null
        }
    }]
} , {timestamps : true});

const progressModel = new mongoose.model("progressModel" , progressSchema);
module.exports = {progressModel};