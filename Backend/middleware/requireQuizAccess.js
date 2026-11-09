
const { canAccessQuiz } = require("../controllers/progressRoutes");

const toWeekName = (week) =>
  /^\s*week\s+\d+\s*$/i.test(String(week))
    ? String(week).trim()
    : `Week ${Number(week) + 1}`; 

async function requireQuizAccess(req, res, next) {
  try {
    const { userid, week } = req.body;

    if (!userid || week === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const access = await canAccessQuiz(userid, toWeekName(week));

    if (!access.allowed) {
      return res
        .status(403)
        .json({ success: false, message: access.message });
    }

    next();
  } catch (error) {
    console.error("requireQuizAccess error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not verify quiz access" });
  }
}

module.exports = requireQuizAccess;