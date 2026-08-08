const express = require('express');
const { connection } = require('./db');
const authRouter = require("./controllers/authRouter");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
    origin : "http://localhost:5173/"
}))
connection();


app.use("/",authRouter);

app.listen(3000,() => {
    console.log("Server is listening at port 3000");
});