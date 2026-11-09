const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const aireviewModel = require("../models/aireviewModel");
const projectModel = require("../models/projectModel");

router.route("/newprojects").post(updateprojects);

router.route("/updateselectedprojects").post(handelUpdateSelectedProjects);

router.route("/selectedprojects").post(getSelectedProjects);

router.route("/completedprojects").post(getCompletedProjects);

router.route("/currentprojects").post(getCurrentProjects);

async function updateprojects(req, res) {
  try {
    const { userid, projectData } = req.body;

    const prompt = `
          You are a friendly mentor helping a student developer grow through hands-on projects.

          COMPLETED PROJECTS:
          ${JSON.stringify(projectData)}

          Recommend EXACTLY 3 NEW projects (no more, no fewer) that a student can realistically build in 1 to 2 weeks.

          ALLOWED TECHNOLOGIES (use only well-known, beginner-friendly tools):
          HTML, CSS, Tailwind CSS, JavaScript, TypeScript, React, Next.js, Node.js, Express.js,
          MongoDB, Mongoose, REST APIs, JWT authentication, Git/GitHub, Postman,
          and popular free services (Cloudinary, Stripe test mode, OpenWeather API, Vercel, Render).
          Do NOT use quantum, blockchain, space, DNA, robotics, hardware or any research-level topics.

          DIFFICULTY RULES:
          1. Each project should be only slightly harder than the completed ones: add ONE or TWO new concepts
            (for example: authentication, pagination, file upload, search and filters, role-based access,
            real-time updates, payments, caching, deployment), not a whole new field.
          2. If no projects are completed yet, start with simple CRUD apps.
          3. Make the 3 projects different from each other (for example: one frontend-focused,
            one backend/API-focused, one full-stack).
          4. Choose familiar real-world ideas such as a task manager, blog platform, expense tracker, e-commerce
            cart, chat app, URL shortener, job board, movie finder or notes app, with a small twist of your own.
          5. Do not repeat or rename any completed project, and do not repeat the same concept or title.

          OUTPUT RULES:
          6. Each title must be short (maximum 8 words) and clear.
          7. description: 2 to 3 simple sentences covering what the app does and its key features.
          8. skillsDeveloped: 3 to 5 plain skills (for example "REST API design", "State management").
          9. technologies: 3 to 6 items, only from the allowed list above.
          10. The "projects" array must contain exactly 3 objects.
          11. Each object must have exactly these four keys: title, description, skillsDeveloped, technologies.
              Do not add any other keys.
          12. Return ONLY valid JSON. No markdown, no code fences, no text before or after.
          13. Don't create repeated projects, every project should be unique.
          Use exactly this structure:

          {
            "projects": [
              {
                "title": "Short project title",
                "description": "2-3 simple sentences about the project and key features",
                "skillsDeveloped": ["Skill 1", "Skill 2", "Skill 3"],
                "technologies": ["Technology 1", "Technology 2", "Technology 3"]
              },
              {
                "title": "Short project title",
                "description": "2-3 simple sentences about the project and key features",
                "skillsDeveloped": ["Skill 1", "Skill 2", "Skill 3"],
                "technologies": ["Technology 1", "Technology 2", "Technology 3"]
              },
              {
                "title": "Short project title",
                "description": "2-3 simple sentences about the project and key features",
                "skillsDeveloped": ["Skill 1", "Skill 2", "Skill 3"],
                "technologies": ["Technology 1", "Technology 2", "Technology 3"]
              }
            ]
          }`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },

        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_object",
          },
        }),
      },
    );

    const aiData = await response.json();
    const ai_data = JSON.parse(aiData.choices[0]?.message.content);

    const responses = await aireviewModel.findOneAndUpdate(
      { userid: userid },
      {
        $set: {
          "review.projects": ai_data,
        },
      },
      { returnDocument: "after" },
    );

    const reponse2 = await projectModel.findOneAndUpdate(
      { userid: userid },
      {
        $set: {
          projectCompleted: [],
          previousCompletedProjects: projectData,
        },
      },
      { upsert: true },
    );

    res.json({
      success: true,
      projects: ai_data,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

async function handelUpdateSelectedProjects(req, res) {
  try {
    const { userid, completedProjects } = req.body;

    const response = await projectModel.findOneAndUpdate(
      { userid: userid },
      {
        $set: {
          projectCompleted: completedProjects,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
      },
    );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

async function getCurrentProjects(req, res) {
  try {
    const { userid } = req.body;

    const response = await aireviewModel.findOne({ userid: userid });

    // console.log(response?.review?.projects);
    res.json({
      success: true,
      currentProjects: response?.review?.projects,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

async function getSelectedProjects(req, res) {
  try {
    const { userid } = req.body;

    const response = await projectModel.findOne({ userid: userid });
    // console.log(response?.projectCompleted);

    res.json({
      success: true,
      projectsCompleted: response?.projectCompleted,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

async function getCompletedProjects(req, res) {
  try {
    const { userid } = req.body;

    const response = await projectModel.findOne({ userid: userid });

    res.json({
      success: true,
      previousProjects: response?.previousCompletedProjects,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}

module.exports = router;
