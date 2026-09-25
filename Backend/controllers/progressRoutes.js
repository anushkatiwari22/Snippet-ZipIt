const express = require("express");
const { progressModel } = require("../models/progressModel");
const router = express.Router();

router.route("/saveprogress").post(saveProgress);

router.route("/getprogress").post(getprogress);

router.route("/getweek").post(getweek);

async function saveProgress(req, res) {
  const { userid, week, completedTasks, allTasks } = req.body;
  // console.log(completedTasks);
  // console.log(allTasks);
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
  // console.log(requiredweek);
  const tasks = requiredweek?.completedTasks;
  return res.json({
    tasks: tasks,
    week: progress?.currentweek,
    completed: requiredweek?.completed,
  });
}


async function getweek(req , res){
  const {userid} = req.body;
  const progress = await progressModel.findOne({userid})
  return res.json({
    currentweek : progress?.currentweek
  })
}


module.exports = router;
