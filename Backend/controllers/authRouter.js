const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");

router
.route("/signup")
.post(postSignUp);


router
.route('/login')
.post(checkuser);


async function postSignUp(req,res){
    const data = req.body;
    console.log(data);
    if(data.password!=data.confirmpassword){
        res.send("password and confirm password are not same");
    }
    const founduser = await userModel.findOnde(email);
    if(founduser){
        res.send("user Already exists");
        res.redirect("/login");
    }
    const user =await  userModel.create({email : data.email , password : data.password , username : data.username});
    user.save();
    res.redirect("/login");
}

async function checkuser(req , res){
    const data = req.body;
    // console.log(data);
    const user = await userModel.find(data.email);
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
    const token = jwt.sign({id : user._ud} , "mykey");
    return token;
}

module.exports = router;


