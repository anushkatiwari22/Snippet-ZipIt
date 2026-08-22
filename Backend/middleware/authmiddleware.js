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
<<<<<<< HEAD
    const verified = jwt.verify(token , process.env.SECRET_ID);
=======
    const verified = jwt.verify(token , process.env.SECRET_KEY);
>>>>>>> 5eea9bbb493ba54d06ba80204109eded927851ac
    return verified;
}