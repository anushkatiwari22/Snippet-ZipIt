const mongoose = require("mongoose");
const userModel = require("./userModel");

const projectSchema = mongoose.Schema({
    projectCompleted : {
        type : Array,
        default : []
    },
    previousCompletedProjects : {
        type : Array,
        default : []
    },
    userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : userModel
    }
},{timestamps : true});

const projectModel = mongoose.model("projectModel",projectSchema);

module.exports = projectModel;