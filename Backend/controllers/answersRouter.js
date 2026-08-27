const express = require('express');
const aireviewModel = require('../models/aireviewModel');
const router = express.Router();


router
.route("/aidata")
.post(getAiData);

async function getAiData(req,res) {
    
    //console.log(req.body);
    const details = req.body;
    console.log(details);

    const response = await aireviewModel.findOne({userid : details.userid});
    console.log(response);
    
    res.json(response);


}

module.exports = router;
