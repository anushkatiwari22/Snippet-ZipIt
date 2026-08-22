const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifytoken=(req , res , next)=>{
    const token = req.token;
    if(!token){
        return next();
    }
    else{
        if(verify(token)){
            
            res.send("successfull");
        }
        else{
            return next();
        }
    }
}


function verify(token){
    const verified = jwt.verify(token , process.env.SECRET_KEY);
    return verified;
}