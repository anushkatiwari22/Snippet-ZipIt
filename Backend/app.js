const express = require('express');
const { connection } = require('./db');
const authRouter = require("./controllers/authRouter");
const questionRouter = require("./controllers/questionsRouter");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const groqrouter = require('./controllers/groqcontroller');
const answerRouter = require('./controllers/answersRouter')
const authmiddleware = require("./middleware/authmiddleware");
const resumeAnalyzerrouter = require("./controllers/resumeAnalyzerRouter");



app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
    origin : "http://localhost:5173" ,
    credentials: true
}))
connection();
app.use(cookieParser());




app.use("/",authRouter);
app.use("/",questionRouter);
app.use('/' , groqrouter);
app.use("/",answerRouter);
app.use("/" , authmiddleware);
app.use("/",resumeAnalyzerrouter);


app.listen(3000,() => {
    console.log("Server is listening at port 3000");
});