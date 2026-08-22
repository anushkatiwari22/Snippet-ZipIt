const mongoose = require("mongoose");
const userModel = require("./userModel")

const questionsSchema = mongoose.Schema(
  {
    data: {
        type: mongoose.Schema.Types.Mixed
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },
  },
  { timeStamps: true },
);

const questionsModel = mongoose.model("questionsModel", questionsSchema);

module.exports = questionsModel;
