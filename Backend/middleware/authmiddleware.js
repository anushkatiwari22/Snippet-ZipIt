const jwt = require("jsonwebtoken");
require("dotenv").config();

const express =  require("express");
const router = express.Router();

router
.route("/verifyuser")
.get(verifyuser);

router
.route("/logout")
.get(logoutuser);

function verifyuser(req , res){
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
                // console.log(verifiedObj.userid);
                
                res.json({
                    userid : verifiedObj.id, 
                    username : verifiedObj.username,
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
            error
        })
    }
}


function verify(token){
    const verified = jwt.verify(token , process.env.SECRET_KEY);
    return verified;
}