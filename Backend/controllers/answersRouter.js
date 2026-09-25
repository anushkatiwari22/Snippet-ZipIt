const express = require('express');
const aireviewModel = require('../models/aireviewModel');
const router = express.Router();


router
.route("/aidata")
.post(getAiData);

router
.route("/checkanswers")
.post(checkData);

async function getAiData(req,res) {
    
    const details = req.body;
    console.log(details);

    const response = await aireviewModel.findOne({userid : details.userid});
    
    res.json(response);
}

async function checkData( req , res ) {
    const details = req.body ;
    const user = await aireviewModel.findOne({userid : details.userid});
    if(user){
        res.json({
            message : "true"
        })
    }
    else{
        res.json({
            message : "false"
        })
    }
}

module.exports = router;
