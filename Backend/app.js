const express = require('express');
const { connection } = require('./db');
const authRouter = require("./controllers/authRouter");
const questionRouter = require("./controllers/questionsRouter");
const app = express();
const cors = require('cors');
const groqrouter = require('./controllers/groqcontroller');
const answerRouter = require('./controllers/answersRouter')





app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
    origin : "http://localhost:5173" ,
    credentials: true
}))
connection();



app.use("/",authRouter);
app.use("/",questionRouter);
app.use('/' , groqrouter);
app.use("/",answerRouter);

app.listen(3000,() => {
    console.log("Server is listening at port 3000");
});