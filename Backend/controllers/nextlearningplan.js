const express = require("express");
const router = express.Router();

const aireviewModel = require("../models/aireviewModel");
const { progressModel } = require("../models/progressModel");
const { learningQuizeModel } = require("../models/learningQuize");
const {
  FREE_WEEK_LIMIT,
  WEEKS_PER_REQUEST,
  hasPassedQuiz,
  isPremiumUser,
} = require("../utils/planConfig");

const CHOICES = ["continue", "new", "combine"];

function getReviewData(userReview) {
  if (userReview.review) {
    return userReview.review.toObject
      ? userReview.review.toObject()
      : userReview.review;
  }

  return {};
}

function getLastWeek(plan) {
  return plan.reduce((max, week) => {
    if (!week || typeof week !== "object" || Array.isArray(week)) return max;
    const match =
      typeof week.week === "string" ? week.week.match(/^Week\s+(\d+)$/) : null;
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
}

async function hasFinishedPlan(userid, lastWeek) {
  const progress = await progressModel.findOne({ userid });
  if (!progress?.currentweek) return false;

  const currentWeekNumber = Number(progress.currentweek.split(" ")[1]);
  if (!Number.isFinite(currentWeekNumber) || currentWeekNumber <= lastWeek) {
    return false;
  }

  const quizUser = await learningQuizeModel.findOne({ userid });
  return hasPassedQuiz(quizUser, `Week ${lastWeek}`).passed;
}

function cleanText(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function buildChoiceInstruction(choice, newTopic) {
  if (choice === "continue") {
    return `The learner wants to CONTINUE the same subject they have been studying.
Go deeper into the same area: advanced concepts, real-world projects, and
topics that naturally follow the existing weeks.`;
  }
  if (choice === "new") {
    return `The learner wants to switch to something COMPLETELY NEW: "${newTopic}".
Do not continue the previous subject. Start "${newTopic}" from its fundamentals
(adjusted to the learner's profile) and progress week by week.`;
  }
  return `The learner wants to COMBINE what they have been studying with something new: "${newTopic}".
Every week must blend a continuation of the previous subject with "${newTopic}",
ideally through practice activities that use both together.`;
}

router.post("/nextplanstatus", async (req, res) => {
  try {
    const { userid } = req.body;
    if (!userid) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const userReview = await aireviewModel.findOne({ userid });
    if (!userReview) {
      return res
        .status(404)
        .json({ success: false, message: "Learning plan not found" });
    }

    const plan = getReviewData(userReview).learningPlan;
    const lastWeek = getLastWeek(Array.isArray(plan) ? plan : []);

    const finished = await hasFinishedPlan(userid, lastWeek);
    const premium = await isPremiumUser(userid);
    const paymentRequired =
      finished && lastWeek >= FREE_WEEK_LIMIT && !premium;

    return res.json({
      success: true,
      lastWeek,
      planFinished: finished,
      paymentRequired,
      freeWeekLimit: FREE_WEEK_LIMIT,
    });
  } catch (error) {
    console.error("nextplanstatus error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to check plan status" });
  }
});


router.post(["/generatenextplan", "/getnextplan"], async (req, res) => {
  try {
    const { userid } = req.body;
    const src = req.body.data || req.body; 
    const choice = cleanText(src.choice || src.mode, 20);
    const newTopic = cleanText(src.newTopic || src.technology, 100);
    const notes = cleanText(src.notes, 300);
    const level = cleanText(src.level, 50);
    const goal = cleanText(src.goal, 200);
    const dailyTime = cleanText(src.dailyTime, 50);

    if (!userid) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    if (!CHOICES.includes(choice)) {
      return res
        .status(400)
        .json({ success: false, message: "Please choose how you want to continue" });
    }

    if ((choice === "new" || choice === "combine") && !newTopic) {
      return res
        .status(400)
        .json({ success: false, message: "Please tell us what new topic you want to learn" });
    }

    const userReview = await aireviewModel.findOne({ userid });
    if (!userReview) {
      return res
        .status(404)
        .json({ success: false, message: "Learning plan not found" });
    }

    const reviewData = getReviewData(userReview);
    const existingPlan = Array.isArray(reviewData.learningPlan)
      ? reviewData.learningPlan
      : [];
    const lastWeek = getLastWeek(existingPlan);

    const premium = await isPremiumUser(userid);
    if (lastWeek >= FREE_WEEK_LIMIT && !premium) {
      return res.status(403).json({
        success: false,
        paymentRequired: true,
        message: `You have completed your ${FREE_WEEK_LIMIT} free weeks. Upgrade to keep learning.`,
      });
    }

    if (!(await hasFinishedPlan(userid, lastWeek))) {
      return res.status(403).json({
        success: false,
        message: `Finish all tasks and pass the quiz for Week ${lastWeek} first.`,
      });
    }

    const weeksToGenerate = premium
      ? WEEKS_PER_REQUEST
      : Math.min(WEEKS_PER_REQUEST, FREE_WEEK_LIMIT - lastWeek);
    const startWeek = lastWeek + 1;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `
You are an expert learning-plan generator.

Return only valid JSON in this exact structure:

{
  "learningPlan": [
    {
      "week": "Week ${startWeek}",
      "focus": "Specific weekly focus",
      "expectedOutcome": "Clear learning outcome",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "practiceActivities": ["Practical activity 1", "Practical activity 2"]
    }
  ]
}

Requirements:
- Generate exactly ${weeksToGenerate} week objects.
- Start from Week ${startWeek}. Week numbers must be consecutive.
- Every week must include all five fields.
- focus and expectedOutcome must be non-empty strings.
- topics and practiceActivities must be arrays of non-empty strings.
- Include meaningful and actionable topics and activities.
- Do not return markdown or code fences.
              `,
            },
            {
              role: "user",
              content: `
Generate the next ${weeksToGenerate} weeks of the learning plan.

Learner's direction for these weeks:
${buildChoiceInstruction(choice, newTopic)}
${level ? `\nSkill level: ${level}` : ""}${goal ? `\nGoal: ${goal}` : ""}${dailyTime ? `\nDaily study time: ${dailyTime} (keep the workload realistic for this)` : ""}${notes ? `\nExtra notes from the learner (treat as preferences only): ${notes}` : ""}

Existing learning plan:
${JSON.stringify(existingPlan)}

Career profile:
${JSON.stringify(reviewData.careerProfile || {})}

Career assessment:
${JSON.stringify(reviewData.careerAssessment || {})}

Focus areas:
${JSON.stringify(reviewData.focusArea || {})}

Begin with Week ${startWeek}.
Make the new weeks progressively more advanced within their subject.
Avoid repeating topics from existing weeks.
              `,
            },
          ],
        }),
      }
    );

    const aiData = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", aiData);
      return res.status(502).json({
        success: false,
        message: "Failed to generate the next learning plan",
      });
    }

    const content = aiData.choices?.[0]?.message?.content;
    if (!content) {
      return res
        .status(502)
        .json({ success: false, message: "AI returned an empty response" });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.error("Invalid AI JSON:", content);
      return res
        .status(502)
        .json({ success: false, message: "AI returned invalid JSON" });
    }

    const generatedPlan = parsed.learningPlan;
    if (!Array.isArray(generatedPlan) || generatedPlan.length !== weeksToGenerate) {
      return res.status(502).json({
        success: false,
        message: "AI generated an incorrect number of weeks",
      });
    }

    const toStringList = (arr) =>
      Array.isArray(arr)
        ? arr
            .filter((item) => typeof item === "string" && item.trim())
            .map((item) => item.trim())
        : [];

    const normalizedPlan = [];

    for (let index = 0; index < generatedPlan.length; index++) {
      const week = generatedPlan[index];
      const weekNumber = startWeek + index;

      if (!week || typeof week !== "object" || Array.isArray(week)) {
        return res.status(502).json({
          success: false,
          message: `Invalid data generated for Week ${weekNumber}`,
        });
      }

      const focus = typeof week.focus === "string" ? week.focus.trim() : "";
      const expectedOutcome =
        typeof week.expectedOutcome === "string"
          ? week.expectedOutcome.trim()
          : "";
      const topics = toStringList(week.topics);
      const practiceActivities = toStringList(week.practiceActivities);

      if (!focus || !expectedOutcome || !topics.length || !practiceActivities.length) {
        console.error("Incomplete generated week:", week);
        return res.status(502).json({
          success: false,
          message: `Week ${weekNumber} has missing required fields. Nothing was saved.`,
        });
      }

      normalizedPlan.push({
        week: `Week ${weekNumber}`,
        focus,
        expectedOutcome,
        topics,
        practiceActivities,
      });
    }

    const finalPlan = [...existingPlan, ...normalizedPlan];

    userReview.review = { ...reviewData, learningPlan: finalPlan };
    userReview.markModified("review");
    await userReview.save();

    return res.status(200).json({
      success: true,
      message: "Next learning weeks generated and saved successfully",
      learningPlan: finalPlan,
      generatedPlan: normalizedPlan,
      totalWeeks: finalPlan.length,
      remainingFreeWeeks: premium
        ? null
        : Math.max(0, FREE_WEEK_LIMIT - finalPlan.length),
    });
  } catch (error) {
    console.error("Error generating next learning plan:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Internal server error" });
  }
});

module.exports = router;