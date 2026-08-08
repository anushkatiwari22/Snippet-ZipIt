const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

router
.route("/signup")
.post(postSignUp);


function postSignUp(req,res){
    console.log(req.body);
}

module.exports = router;


