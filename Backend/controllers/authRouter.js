const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const questionsModel = require('../models/questionsModel');
const { signupValidation, loginValidation } = require('../middleware/authValidation');
require('dotenv').config();

router
.route("/signup")
.post(signupValidation ,postSignUp);


router
.route('/login')
.post(loginValidation ,postLogin);


async function postSignUp(req,res){
    const data = req.body;
    //console.log(data);
    if(data.password!=data.confirmpassword){
        res.json({
            message : "password and confirm password does not match"
        })
    }
    const founduser = await userModel.findOne({email : data.email});
    if(founduser){
        res.json({
            message : "User Already Exsist"
        });
    }
    else{
        const user =await  userModel.create({email : data.email , password : data.password , username : data.username});
        user.save();

        // const questionInfo = questionsModel.create();
        // questionInfo.save();
        res.json({
            message : "success"
        });
    }
}

async function postLogin(req , res){
    const data = req.body;
    // console.log(data);
    const user = await userModel.findOne({email : data.email});
    if(user){
        if(user.password == data.password){
            const token = getjwt(user);
            res.cookie("token" , token, {
                httpOnly : true ,
                maxAge : 1000*60*60*24
            })
            res.json({
                success : "true" ,
                userid : user._id , 
                username : user.username 
            })
        }
        else{
            res.json({
                success : "false" , 
                message : " incorrect password"
            });
        }
    }
    else{
        res.json({
            success : "false" ,
            message : "user does not exists"
        });
    }
}

function getjwt(user){
    const token = jwt.sign({id : user._id} , process.env.SECRET_ID);
    return token;
}

module.exports = router;


