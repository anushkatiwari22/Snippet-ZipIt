const mongoose  = require('mongoose');

const resumeAnalyserSchema = mongoose.Schema({
    userid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    },
    resumeAnalysis : {
        type : mongoose.Schema.Types.Mixed,
        default: null
    }
})

const resumeAnalyserModel = mongoose.model("resumeAnalyserModel",resumeAnalyserSchema);

module.exports = resumeAnalyserModel;