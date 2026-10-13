const express = require("express");
const { progressModel } = require("../models/progressModel");
const { learningQuizeModel } = require("../models/learningQuize");
const router = express.Router();

router.route("/saveprogress").post(saveProgress);

router.route("/getprogress").post(getprogress);

router.route("/getweek").post(getweek);

router.route("/checkquize").post(checkquize);

async function saveProgress(req, res) {
  const { userid, week, completedTasks, allTasks } = req.body;
  let progress = await progressModel.findOne({ userid });
  let completed = false;
  if (!progress) {
    completed = completedTasks.length === allTasks.length;
    console.log("without progress object");
    progress = await progressModel.create({
      userid,
      currentweek: completed ? `Week ${Number(week.split(" ")[1]) + 1}` : week,
      progress: [
        {
          week,
          completedTasks,
          completed,
        },
      ],
    });
  } else {
    const existingWeek = progress.progress.find((p) => p.week === week);

    if (existingWeek) {
      console.log("week exists");

      completedTasks.forEach((task) => {
        if (!existingWeek.completedTasks.includes(task)) {
          existingWeek.completedTasks.push(task);
        }
      });

      const wasCompleted = existingWeek.completed;

      completed = existingWeek.completedTasks.length === allTasks.length;
      existingWeek.completed = completed;

      if (!wasCompleted && completed) {
        progress.currentweek = `Week ${
          Number(progress.currentweek.split(" ")[1]) + 1
        }`;
      }
    } else {
      completed = completedTasks.length === allTasks.length;

      if (completed) {
        progress.currentweek = `Week ${
          Number(progress.currentweek.split(" ")[1]) + 1
        }`;
      }

      console.log("new week");

      progress.progress.push({
        week,
        completedTasks,
        completed,
      });
    }
  }
  await progress.save();
  res.json({
    completed: completed,
  });
}

async function getprogress(req, res) {
  const { userid, week } = req.body;
  const progress = await progressModel.findOne({ userid });
  const requiredweek = progress?.progress.find((p) => p.week == week);
  const tasks = requiredweek?.completedTasks;
  
  return res.json({
    tasks: tasks,
    week: progress?.currentweek,
    completed: requiredweek?.completed,
  });
}

async function getweek(req, res) {
  try {
    const { userid } = req.body;

    const progress = await progressModel.findOne({ userid });
    const quizUser = await learningQuizeModel.findOne({ userid });

    let quizPassed = false;

    if (progress?.currentweek) {
      const weekNumber = Number(progress.currentweek.split(" ")[1]) - 1;
      const weekName = `Week ${weekNumber}`;

      const weekAnswers = quizUser?.answers.find(
        (item) => item.week === weekName
      );

      if (weekAnswers && weekAnswers.answers.length >= 10) {
        const correctCount = weekAnswers.answers.filter(
          (answer) => answer.correct === true
        ).length;

        quizPassed = correctCount >= 5;
      }
    }

    return res.json({
      currentweek: progress?.currentweek,
      quizPassed,
    });
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
      return res.json({
        success: false,
        message: "Quiz record not found",
      });
    }

    const weekAnswers = user.answers.find(
      (item) => item.week === week
    );

    if (!weekAnswers || weekAnswers.answers.length < 10) {
      return res.json({
        success: true,
        passed: false,
        message: "Quiz not completed",
      });
    }

    const correctCount = weekAnswers.answers.filter(
      (answer) => answer.correct === true
    ).length;

    return res.json({
      success: true,
      passed: correctCount >= 5,
      correctCount,
      totalQuestions: 10,
    });
  } catch (error) {
    console.error("checkquize error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check quiz",
    });
  }
}

module.exports = router;
