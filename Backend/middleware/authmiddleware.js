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
    catch(error){
        res.json({
            message : error , 
            success : "false"
        })
    }
    
}

function logoutuser(req , res){
    try{
        res.clearCookie("token");
        res.json({
            message : "cleared cookie" , 
            success : "true"
        })
    }
    catch(error){
        res.json({
            message : error ,
            success : "false"
        })
    }
}



function verify(token){
    const verified = jwt.verify(token , process.env.SECRET_ID);
    // console.log("verified obj : ")
    // console.log(verified);
    return verified;
}
module.exports = router;