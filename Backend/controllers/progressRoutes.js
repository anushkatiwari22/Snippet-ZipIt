const express = require("express");
const { progressModel } = require("../models/progressModel");
const { learningQuizeModel } = require("../models/learningQuize");
const { QUIZ_QUESTIONS, hasPassedQuiz } = require("../utils/planConfig");
const router = express.Router();

router.route("/saveprogress").post(saveProgress);
router.route("/getprogress").post(getprogress);
router.route("/getweek").post(getweek);
router.route("/checkquize").post(checkquize);
router.route("/canaccessquiz").post(canAccessQuizRoute);
const weekNumber = (name) => Number(String(name ?? "").match(/\d+/)?.[0]);
const weekName = (n) => `Week ${n}`;
const nextWeekName = (name) => weekName(weekNumber(name) + 1);
const clean = (s) => String(s ?? "").trim();

async function saveProgress(req, res) {
  try {
    const { userid, week, completedTasks = [], allTasks = [] } = req.body;

    let progress = await progressModel.findOne({ userid });

    if (!progress) {
      progress = new progressModel({
        userid,
        currentweek: week,
        progress: [],
      });
    }

    let weekEntry = progress.progress.find((p) => p.week === week);

    if (!weekEntry) {
      progress.progress.push({ week, completedTasks: [], completed: false });
      weekEntry = progress.progress[progress.progress.length - 1];
    }

    completedTasks.forEach((task) => {
      if (!weekEntry.completedTasks.includes(task)) {
        weekEntry.completedTasks.push(task);
      }
    });

    const completed =
      allTasks.length > 0 &&
      allTasks.every((task) => weekEntry.completedTasks.includes(task));

    weekEntry.completed = weekEntry.completed || completed;

    progress.markModified("progress");
    await progress.save();

    res.json({ completed });
  } catch (error) {
    console.error("saveProgress error:", error);
    res.status(500).json({ success: false, message: "Failed to save progress" });
  }
}

async function getprogress(req, res) {
  try {
    const { userid, week } = req.body;
    const progress = await progressModel.findOne({ userid });
    const requiredweek = progress?.progress.find((p) => clean(p.week) === clean(week));

    return res.json({
      tasks: requiredweek?.completedTasks || [],
      week: progress?.currentweek,
      completed: requiredweek?.completed || false,
    });
  } catch (error) {
    console.error("getprogress error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch progress" });
  }
}

async function getweek(req, res) {
  try {
    const { userid } = req.body;

    const progress = await progressModel.findOne({ userid });
    const quizUser = await learningQuizeModel.findOne({ userid });
    const currentweek = progress?.currentweek || weekName(1);
    const current = weekNumber(currentweek);
    let quizPassed = true;
    if (current > 1) {
      quizPassed = quizUser
        ? Boolean(hasPassedQuiz(quizUser, weekName(current - 1)).passed)
        : false;
    }

    return res.json({ currentweek, quizPassed });
  } catch (error) {
    console.error("getweek error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch current week",
    });
  }
}

async function checkquize(req, res) {
  try {
    const { userid, week } = req.body;

    const user = await learningQuizeModel.findOne({ userid });
    if (!user) {
      return res.json({ success: false, message: "Quiz record not found" });
    }

    const { passed, correctCount } = hasPassedQuiz(user, week);
    const weekAnswers = user.answers.find((item) => item.week === week);

    if (!weekAnswers || weekAnswers.answers.length < QUIZ_QUESTIONS) {
      return res.json({
        success: true,
        passed: false,
        message: "Quiz not completed",
      });
    }

    let nextWeek;

    if (passed) {
      const progress = await progressModel.findOne({ userid });

      if (progress) {
        if (weekNumber(progress.currentweek) <= weekNumber(week)) {
          progress.currentweek = nextWeekName(week);
          await progress.save();
        }
        nextWeek = progress.currentweek;
      }
    }

    return res.json({
      success: true,
      passed,
      correctCount,
      totalQuestions: QUIZ_QUESTIONS,
      nextWeek,
    });
  } catch (error) {
    console.error("checkquize error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check quiz",
    });
  }
}


async function canAccessQuiz(userid, week) {
  const requested = weekNumber(week);
  if (!userid || !Number.isFinite(requested) || requested < 1) {
    return { allowed: false, message: "Invalid quiz" };
  }

  const progress = await progressModel.findOne({ userid });
  if (!progress) {
    return { allowed: false, message: "Complete this week's tasks first" };
  }

  if (requested > weekNumber(progress.currentweek)) {
    return { allowed: false, message: "Finish the previous week first" };
  }

  const entry = progress.progress.find((p) =>clean(p.week) === clean(week));
  if (!entry || !entry.completed) {
    return { allowed: false, message: "Complete all tasks to unlock this quiz" };
  }

  return { allowed: true };
}

async function canAccessQuizRoute(req, res) {
  try {
    const { userid, week } = req.body;
    return res.json(await canAccessQuiz(userid, week));
  } catch (error) {
    console.error("canAccessQuiz error:", error);
    return res.status(500).json({ allowed: false, message: "Something went wrong" });
  }
}


module.exports = router;
module.exports.canAccessQuiz = canAccessQuiz;