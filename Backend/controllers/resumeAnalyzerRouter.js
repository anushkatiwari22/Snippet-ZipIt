const Groq = require("../utils/groq");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const userModel = require("../models/userModel");
const { PDFParse } = require("pdf-parse");

const upload = multer({
    storage: multer.memoryStorage()
});


router
.route("/resumeanalysiscount")
.post(getResumeAnalysisCount);

router
.route("/updateresumeanalysiscount")
.post(updateResumeAnalysisCount);

router
.route("/analyze-pdf")
.post(upload.single("pdf"),getResumeAnalysis);


async function getResumeAnalysisCount(req, res) {
    try {
        const { userid } = req.body;
        // console.log(userid);
        const resumeAnalysisCount = await userModel.findOne({_id : userid});
        // console.log(resumeAnalysisCount);
        res.json({
            count : resumeAnalysisCount.resumeAnalysisCount
        });
    } 
    catch(error) {
        console.log(error);
        res.json({
            error : error
        })
    } 
}

async function updateResumeAnalysisCount(req, res) {
    try {
        const { userid,count } = req.body;
        // console.log(count);
        const updateCount = await userModel.findOneAndUpdate({_id : userid},{
            resumeAnalysisCount : count
        })
        res.json({
            success : "true"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success : "false"
        });
    }
}

async function getResumeAnalysis(req, res) {
    
    try{

        const parser = new PDFParse({
            data : req.file.buffer
        })
        
        const data = await parser.getText();

        
        const text = data.text;

        if(text?.length < 100){
            return res.json({
                response : "Upload your resume again, possibly in a different format."
            })
        }

        const prompt = `
        You are an expert resume reviewer and ATS (Applicant Tracking System) specialist with years of experience in recruitment and hiring across multiple industries. Analyze the resume provided below in detail.

        Please give me:
        
        Overall Summary – A brief 2-3 sentence overview of the resume's overall quality and first impression.
        ATS Compatibility Score – Give a score out of 100 based on:
        Formatting (use of tables, columns, images, graphics that ATS may not parse)
        Keyword optimization (relevant skills, tools, and industry terms)
            Section headings (standard vs. non-standard naming)
            File structure and readability for parsing software
            Contact info and section completeness
            Break down the score with a short explanation for each category.
            Detailed Section-by-Section Analysis – Review each section (Summary/Objective, Work Experience, Skills, Education, Projects, Certifications, etc.) and comment on:
            Clarity and impact of the content
            Use of action verbs and quantifiable achievements (numbers, %, results)
            Relevance to [target job role/industry — mention if applicable]
            Grammar, tone, and consistency
            Missing or Weak Elements – Point out any important sections, keywords, or details that are missing or underdeveloped.
            Areas of Improvement – Give a clear, prioritized list of actionable recommendations (what to add, remove, rephrase, or restructure) to improve both ATS score and human readability.
            Suggested Rewrite Examples – Pick 2-3 weak bullet points from the resume and rewrite them in an improved, results-driven format as examples.
            
            Here is the resume: ${text}
            
            Return the response as valid JSON with these keys:
            overallSummary,
            atsCompatibilityScore,
            detailedSectionBySectionAnalysis,
            missingOrWeakElements,
            areasOfImprovement,
            suggestedRewriteExamples
            `
            // console.log("PROMPT:");
            // console.log(prompt);

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions" , {
        "method" : "POST" ,
        "headers" : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        } ,

        "body" : JSON.stringify({
            model: "openai/gpt-oss-120b",
              messages: [
            {
              role: "user",
              content: prompt,
            },
          ]
           ,
            response_format: {
              type: "json_object"
            }
        })
    })
        const aiData = await response.json();
        // console.log("GROQ RESPONSE:", aiData);
        const ai_data = JSON.parse(aiData.choices[0]?.message.content) ;
        
        res.json({
            response : ai_data
        })
    }
    catch(error) {
        console.log(error);
    }
}

module.exports = router;
