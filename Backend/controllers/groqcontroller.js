const aireviewModel = require("../models/aireviewModel");
const Groq = require("../utils/groq");
const express = require("express");
const router = express.Router();
require('dotenv').config();

router.route("/getDashboard").post(getDashboard);

async function getDashboard(req, res) {
  const { data } = req.body;
  const prompt = `
You are an AI Career Coach.

Your task is to analyze the following career assessment responses and generate a personalized career development report.

USER ASSESSMENT:
${JSON.stringify(data, null, 2)}

Analyze the user's:
- Target role
- Experience level
- Current technologies
- Career goal
- Available daily preparation time
- Most challenging area
- Preferred learning method

Generate a practical and personalized report.

The report must contain the following sections:

1. Career Profile
- Target role
- Current experience level
- Current technical skills
- Career goal
- Daily available time
- Preferred learning style

2. Career Assessment
- Evaluate how well the user's current skills align with their target role.
- Identify their strengths.
- Identify important skill gaps.
- Give an overall assessment of their current position.

3. Skills To Improve
- List the most important technical skills they should learn or improve.
- Prioritize them as High, Medium, or Low.
- Focus on skills that are relevant to their target role.

4. Focus Area
- Give detailed guidance for the area they find most challenging.
- Explain how they should improve in this area.
- Suggest specific topics they should practice.

5. Personalized Learning Plan
Create a realistic learning plan based on the amount of time the user can dedicate each day.
Break the plan into 4 weeks.

For each week include:
- Main focus
- Topics to learn
- Practice activities
- Expected outcome

6. Project Recommendations
Suggest 3 projects that would help the user become stronger in their target role.
For each project explain:
- Project idea
- Technologies to use
- Skills it will develop

7. Career Preparation Tips
Give 5 practical recommendations for improving their chances of getting an internship or job in their target role.

8. Final Assessment
Provide:
- Current readiness level for the target role
- Top 3 priorities
- One short motivational message

IMPORTANT:
- Make the report specific to the user's answers.
- Do not give generic career advice.
- Respect the user's available preparation time.
- Do not assume skills that the user has not mentioned.
- Since the user prefers reading documentation, recommend documentation-based learning resources and strategies.
- Keep the language clear and student-friendly.

Return ONLY valid JSON in exactly this structure:

{
  "careerProfile": {
    "targetRole": "",
    "experienceLevel": "",
    "currentSkills": [],
    "careerGoal": "",
    "dailyTime": "",
    "learningPreference": ""
  },
  "careerAssessment": {
    "strengths": [],
    "skillGaps": [],
    "overallAssessment": ""
  },
  "focusArea": {
    "area": "",
    "whyItMatters": "",
    "topicsToPractice": [],
    "improvementStrategy": []
  },
  "learningPlan": [
    {
      "week": "Week 1",
      "focus": "",
      "topics": [],
      "practiceActivities": [],
      "expectedOutcome": ""
    },
    {
      "week": "Week 2",
      "focus": "",
      "topics": [],
      "practiceActivities": [],
      "expectedOutcome": ""
    },
    {
      "week": "Week 3",
      "focus": "",
      "topics": [],
      "practiceActivities": [],
      "expectedOutcome": ""
    },
    {
      "week": "Week 4",
      "focus": "",
      "topics": [],
      "practiceActivities": [],
      "expectedOutcome": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": [],
      "skillsDeveloped": []
    }
  ],
  "careerTips": [],
  "finalAssessment": {
    "readinessLevel": "",
    "topPriorities": [],
    "message": ""
  }
}
`;


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
    // console.log(aiData.choices[0].message.content);
    const ai_data = JSON.parse(aiData.choices[0]?.message.content) ;
    const {userid} = req.body;

    const newdata = await aireviewModel.create({review : ai_data , userid : userid})
    newdata.save();
    console.log("data saved in db");
    res.json({
      success : "true" ,
      message : "answers received"
    })
    
}


module.exports = router;
