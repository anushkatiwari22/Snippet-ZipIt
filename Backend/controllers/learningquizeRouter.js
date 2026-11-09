const Groq = require("../utils/groq");
const express = require("express");
const router = express.Router();
require("dotenv").config();
const aireviewModel = require("../models/aireviewModel");
const requireQuizAccess = require("../middleware/requireQuizAccess");

const { learningQuizeModel } = require("../models/learningQuize");
const { QUIZ_QUESTIONS, QUIZ_PASS_MARK } = require("../utils/planConfig");

router.route("/getquize").post(requireQuizAccess ,getlearningquize);
router.route("/saveoption").post(requireQuizAccess,saveoption);
router.route("/showresult").post(requireQuizAccess, showresult);


const inFlight = new Map(); 

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function normalizeQuestions(raw) {
  if (!Array.isArray(raw) || raw.length !== QUIZ_QUESTIONS) return null;

  const letters = ["a", "b", "c", "d"];
  const out = [];

  for (const q of raw) {
    if (
      !q ||
      typeof q.question !== "string" ||
      !Array.isArray(q.options) ||
      q.options.length !== 4
    ) {
      return null;
    }

    const options = q.options.map((o) => String(o).trim());
    const answer = String(q.answer ?? "").trim();

    let match = options.find((o) => o === answer);
    if (!match) {
      match = options.find((o) => o.toLowerCase() === answer.toLowerCase());
    }
    if (!match) {
      const letter = answer.match(/^(?:option\s*)?([a-d])[).:]?$/i);
      if (letter) match = options[letters.indexOf(letter[1].toLowerCase())];
    }
    if (!match) return null;

    out.push({
      question: q.question.trim(),
      options,
      answer: match,
      explanation: String(q.explanation ?? "").trim(),
    });
  }

  return out;
}

async function loadOrCreateQuiz(userid, week) {
  const userdata = await aireviewModel.findOne({ userid });
  if (!userdata) throw httpError(404, "Learning plan not found");

  const weekPlan = userdata.review?.learningPlan?.find((w) => w.week === week);
  if (!weekPlan) throw httpError(404, `${week} is not in your learning plan`);

  let userQuiz = await learningQuizeModel.findOne({ userid });

  const existingWeek = userQuiz?.questions.find((q) => q.week === week);
  if (existingWeek) return existingWeek.questions;

  const prompt = `
        You are an expert technical instructor.

    Based on the following weekly learning plan, generate a quiz to evaluate the student's understanding.

    Week: ${weekPlan.week}

    Focus:
    ${weekPlan.focus}

    Topics Covered:
    ${weekPlan.topics.join("\n")}

    Practice Activities:
    ${weekPlan.practiceActivities.join("\n")}

    Expected Outcome:
    ${weekPlan.expectedOutcome}

    Requirements:
    1. Generate exactly 10 multiple-choice questions.
    2. Questions should be based ONLY on the topics and activities covered in this week.
    3. Mix easy, medium, and hard questions.
    4. Each question must have exactly 4 options.
    5. Only one option should be correct.
    6. The "answer" field must be the exact full text of the correct option, copied character for character from the options array.
    7. Include an explanation for the correct answer.
    8. Do not generate questions from topics outside this week's plan.
    9. Return ONLY valid JSON.

      Return ONLY a valid JSON object.

      Format:

      {
        "questions": [
          {
            "question": "Question text",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "answer": "Correct Option",
            "explanation": "Explanation"
          }
        ]
      }

      Generate exactly 10 questions inside the questions array.
      Do not return markdown.
      Do not return code fences.
      Do not return any text outside the JSON object.
      `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });

  const ai_questions = await response.json();
  if (!ai_questions?.choices?.length) {
    console.error("Groq did not return choices:", ai_questions);
    throw httpError(502, "Could not generate the quiz. Please try again.");
  }

  let parsed;
  try {
    parsed = JSON.parse(ai_questions.choices[0].message.content);
  } catch (error) {
    throw httpError(502, "Quiz generation returned invalid data. Please try again.");
  }

  const questionsArray = normalizeQuestions(parsed.questions);
  if (!questionsArray) {
    throw httpError(502, "Quiz generation was incomplete. Please try again.");
  }

  if (!userQuiz) {
    await learningQuizeModel.create({
      userid,
      questions: [{ week, questions: questionsArray }],
    });
  } else {
    userQuiz.questions.push({ week, questions: questionsArray });
    await userQuiz.save();
  }

  return questionsArray;
}

async function getlearningquize(req, res) {
  try {
    const { userid } = req.body;
    const week = `Week ${Number(req.body.week) + 1}`;
    const key = `${userid}:${week}`;

    if (!inFlight.has(key)) {
      inFlight.set(
        key,
        loadOrCreateQuiz(userid, week).finally(() => inFlight.delete(key)),
      );
    }

    const questions = await inFlight.get(key);

    return res.json({
      quiz: questions.map((q) => ({ question: q.question, options: q.options })),
    });
  } catch (error) {
    console.error("getquize error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to load quiz",
    });
  }
}

async function saveoption(req, res) {
  try {
    const { questionIndex, userid, option, week } = req.body;

    if (
      !userid ||
      week === undefined ||
      questionIndex === undefined ||
      !option
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await learningQuizeModel.findOne({ userid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Quiz document not found",
      });
    }

    const weekName = String(week).startsWith("Week ")
      ? String(week)
      : `Week ${Number(week) + 1}`;

    const weekQuiz = user.questions.find((item) => item.week === weekName);

    if (!weekQuiz) {
      return res.status(404).json({
        success: false,
        message: `Quiz not found for ${weekName}`,
      });
    }

    const index = Number(questionIndex);
    const question = weekQuiz.questions[index];

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    let weekAnswers = user.answers.find((item) => item.week === weekName);

    if (!weekAnswers) {
      user.answers.push({
        week: weekName,
        answers: [],
      });

      weekAnswers = user.answers[user.answers.length - 1];
    }

    const existingAnswer = weekAnswers.answers.find(
      (item) => item.questionindex === index,
    );

    if (existingAnswer) {
      return res.status(409).json({
        success: false,
        message: "This question has already been answered",
      });
    }

    weekAnswers.answers.push({
      questionindex: index,
      question: question.question,
      options: question.options,
      correctAnswer: question.answer,
      explanation: question.explanation,
      selectedOption: option,
      correct: question.answer === option,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      correct: question.answer === option,
      message: "Answer saved successfully",
    });
  } catch (error) {
    console.error("saveoption error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save answer",
    });
  }
}

async function showresult(req, res) {
  try {
    const { userid, week } = req.body;

    const user = await learningQuizeModel.findOne({ userid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const weekName = String(week).startsWith("Week ")
      ? String(week)
      : `Week ${Number(week) + 1}`;

    const weekQuiz = user.questions.find((item) => item.week === weekName);

    if (!weekQuiz) {
      return res.status(404).json({
        success: false,
        message: "Week quiz not found",
      });
    }

    const weekAnswers = user.answers.find((item) => item.week === weekName);

    const results = weekQuiz.questions.map((question, index) => {
      const savedAnswer = weekAnswers?.answers.find(
        (answer) => answer.questionindex === index,
      );

      return {
        questionindex: index,
        question: question.question,
        correctAnswer: question.answer,
        explanation: question.explanation,
        selectedOption: savedAnswer?.selectedOption ?? null,
        correct: savedAnswer?.correct ?? null,
      };
    });

    const score = results.filter((item) => item.correct === true).length;

    const totalQuestions = results.length;

    return res.status(200).json({
      success: true,
      week: weekName,
      score,
      totalQuestions,
      passMark: QUIZ_PASS_MARK,
      passed: score >= QUIZ_PASS_MARK,
      attempted: results.filter((item) => item.correct !== null).length,
      results,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch results",
    });
  }
}

router.post("/getquestion", requireQuizAccess, async (req, res) => {
  try {
    const { userid, week } = req.body;

    const weekName = String(week).startsWith("Week ")
      ? String(week)
      : `Week ${Number(week) + 1}`;

    const user = await learningQuizeModel.findOne({ userid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const weekAnswers = user.answers.find((item) => item.week === weekName);

    const lastAnswer =
      weekAnswers?.answers?.length > 0
        ? weekAnswers.answers[weekAnswers.answers.length - 1]
        : null;

    return res.json({
      success: true,
      currentQuestion: lastAnswer ? lastAnswer.questionindex : -1,
    });
  } catch (error) {
    console.error("Get current question error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get current question",
    });
  }
});

router.post("/reattempt",requireQuizAccess, async (req, res) => {
  try {
    const { userid, week } = req.body;

    const user = await learningQuizeModel.findOne({ userid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Quiz record not found",
      });
    }

    const weekAnswers = user.answers.find(
      (item) => item.week === week
    );

    if (weekAnswers) {
      weekAnswers.answers = [];
      await user.save();
    }

    return res.json({
      success: true,
      message: "Quiz reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset quiz",
    });
  }
});

module.exports = router;