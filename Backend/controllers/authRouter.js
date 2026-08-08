const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();

router
.route("/signup")
.post(postSignUp);


router
.route('/login')
.post(postLogin);


async function postSignUp(req,res){
    const data = req.body;
    console.log(data);
    if(data.password!=data.confirmpassword){
        res.send("password and confirm password are not same");
    }
    const founduser = await userModel.findOne({email : data.email});
    if(founduser){
        res.send("user Already exists");
    }
    else{
        const user =await  userModel.create({email : data.email , password : data.password , username : data.username});
        user.save();
        res.send("success");
    }
}

async function postLogin(req , res){
    const data = req.body;
    // console.log(data);
    const user = await userModel.find({email : data.email});
    if(user){
        if(user.password == data.password){
            const token = getjwt(user);
            res.cookie("token" , token, {
                httpOnly : true ,
                maxAge : 1000*60*60*24
            })
            res.send("login Successfull");
        }
        else{
            res.send("Incorrect password");
        }
    }
    else{
        res.send("user Does not exists");
    }

}

function getjwt(user){
    const token = jwt.sign({id : user._id} , process.env.SECRET_ID);
    return token;
}

module.exports = router;


