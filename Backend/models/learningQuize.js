const mongoose = require("mongoose");

const learningquizeSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
  questions: [
    {
      week: {
        type: String,
        required: true,
      },
      questions: [
        {
          question: String,
          options: [String],
          answer: String,
          explanation: String,
        },
      ],
    },
  ],
  answers : [
    {
      week : {
        type : String , 
        required : true
      } ,
      answers : [
        {
          questionindex : Number ,
          selectedOption : String , 
          correct : Boolean
        }
      ]
    }
  ]
});

const learningQuizeModel = mongoose.model(
  "learningQuizeModel",
  learningquizeSchema,
);

module.exports = { learningQuizeModel };
