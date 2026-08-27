const express = require('express');
const mongoose = require('mongoose');
const questionRouter = express.Router();
const questionsModel = require('../models/questionsModel');


questionRouter
.route("/questioninfo")
.post(updateQuestionsInfo);


async function updateQuestionsInfo(req, res) {
    
    const {data , userid} = req.body;

    const questions = await questionsModel.create({data : data , userid  : userid});
    questions.save();

    res.json({
        success : "true"
    });
}





module.exports = questionRouter;