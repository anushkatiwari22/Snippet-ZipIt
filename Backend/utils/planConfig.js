module.exports = {
  FREE_WEEK_LIMIT: 8,      
  WEEKS_PER_REQUEST: 4,    
  QUIZ_QUESTIONS: 10,      
  QUIZ_PASS_MARK: 1,       
  async isPremiumUser(userid) {
    return false;
  },

  hasPassedQuiz(quizUser, weekName) {
    const entry = quizUser?.answers?.find((item) => item.week === weekName);
    if (!entry || entry.answers.length < module.exports.QUIZ_QUESTIONS) {
      return { passed: false, correctCount: 0 };
    }
    const correctCount = entry.answers.filter((a) => a.correct === true).length;
    return {
      passed: correctCount >= module.exports.QUIZ_PASS_MARK,
      correctCount,
    };
  },
};