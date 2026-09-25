const jwt = require("jsonwebtoken");
require("dotenv").config();

const express =  require("express");
const userModel = require("../models/userModel");
const router = express.Router();

router
.route("/verifyuser")
.get(verifyuser);

router
.route("/logout")
.get(logoutuser);

async function verifyuser(req , res){
    try{
        const token = req.cookies.token;
        // console.log(token);
        if(!token){
            res.json({
                message : "unauthorized user" , 
                success : "false"
            })
        }
        else{
            if(verify(token)){
                const verifiedObj = verify(token);
                
                const user = await userModel.findOne({username : verifiedObj.username});
                
                res.json({
                    userid : user.id, 
                    username : user.username,
                    message : "valid user" , 
                    success : "true"
                })
            }
            else{
                res.json({
                    message : "unauthorized user" , 
                    success : "false"
                })
            }
        }
    }
}


function verify(token){
    const verified = jwt.verify(token , process.env.SECRET_KEY);
    return verified;
}