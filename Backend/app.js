const express = require('express');
const { connection } = require('./db');
const app = express();
connection();

app.listen(3000,() => {
    console.log("Server is listening at port 3000");
});