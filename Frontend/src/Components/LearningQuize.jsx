import UserContext from "../utils/UserContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/popups";

const API = "http://localhost:3000";

const LearningQuize = () => {
  const { week } = useParams();
  const { obj } = useContext(UserContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [saving, setSaving] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [passMark, setPassMark] = useState(null);
  const [passed, setPassed] = useState(false);
  const [attempted, setAttempted] = useState(0);
  const [error, setError] = useState("");

  const isLast = currentQuestion === data.length - 1;

const loadResult = async () => {
  const resp = await axios.post(`${API}/showresult`, { userid: obj?.userid, week });

  if (resp.data.success) {
    setResults(resp.data.results);
    setScore(resp.data.score);
    setTotalQuestions(resp.data.totalQuestions);
    setPassMark(resp.data.passMark ?? null);
    setPassed(Boolean(resp.data.passed));
    setAttempted(resp.data.attempted ?? resp.data.totalQuestions);
    setShowResult(true);

    if (resp.data.passed) {
      try {
        await axios.post(`${API}/checkquize`, {
          userid: obj?.userid,
          week: `Week ${Number(week) + 1}`,
        });
      } catch (e) {
        handleError("Passed, but could not unlock the next week");
      }
    }
  }
};

  useEffect(() => {
    if (!obj?.userid || week === undefined) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        setShowResult(false);

        const quizResp = await axios.post(`${API}/getquize`, {
          userid: obj.userid,
          week,
        });
        const quiz = quizResp.data.quiz || [];

        const progressResp = await axios.post(`${API}/getquestion`, {
          userid: obj.userid,
          week,
        });
        const lastSaved = Number(progressResp.data.currentQuestion); 

        if (cancelled) return;

        setData(quiz);
        setSelectedOption("");

        if (quiz.length > 0 && lastSaved >= quiz.length - 1) {
          await loadResult();
        } else {
          setCurrentQuestion(lastSaved + 1);
        }
      } catch (error) {
        if (!cancelled) {
            const msg = error.response?.data?.message || "Failed to load quiz";
            setError(msg);
          handleError(error.response?.data?.message || "Failed to load quiz");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [obj?.userid, week]);

  const saveAnswer = async () => {
    try {
      await axios.post(`${API}/saveoption`, {
        questionIndex: currentQuestion,
        userid: obj?.userid,
        option: selectedOption,
        week,
      });
    } catch (error) {
      if (error.response?.status !== 409) throw error;
    }
  };

  const handleNext = async () => {
    if (selectedOption === "") {
      handleError("Select an option first");
      return;
    }
    if (saving) return;

    try {
      setSaving(true);
      await saveAnswer();

      if (isLast) {
        await loadResult();
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption("");
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Failed to save answer");
    } finally {
      setSaving(false);
    }
  };

  const reattempt = async () => {
    try {
      const resp = await axios.post(`${API}/reattempt`, {
        userid: obj?.userid,
        week: `Week ${Number(week) + 1}`,
      });

      if (resp.data.success) {
        setCurrentQuestion(0);
        setSelectedOption("");
        setShowResult(false);
        setResults([]);
        setScore(0);
        setTotalQuestions(0);
        handleSuccess("Quiz restarted");
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Failed to restart quiz");
    }
  };

  const redirection = () => {
    navigate("/dashboard/learning-plan");
  };

  if (error) {
  return (
    <div className="min-h-screen flex flex-col gap-4 justify-center items-center">
      <p className="text-red-600">{error}</p>
      <button onClick={redirection} className="px-6 py-3 rounded-2xl bg-amber-400 font-semibold">
        Back to learning plan
      </button>
    </div>
  );
}

  if (loading || data.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (showResult) {
    const skipped = totalQuestions - attempted;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Quiz Results</h1>

          <p className="mb-2 text-xl font-semibold text-green-700">
            Score: {score}/{totalQuestions}
          </p>

          <p
            className={`mb-8 font-medium ${
              passed ? "text-green-700" : "text-red-600"
            }`}
          >
            {passed
              ? "You passed. You can move on to the next week."
              : `You need at least ${passMark ?? "the pass mark"} correct answers to move on. Reattempt the quiz to try again.`}
          </p>

          {skipped > 0 && (
            <p className="mb-6 rounded-xl bg-amber-100 p-4 text-amber-900">
              {skipped} question{skipped > 1 ? "s were" : " was"} not answered.
              Reattempt the quiz to answer all questions.
            </p>
          )}

          <div className="space-y-6">
            {results.map((item) => (
              <div
                key={item.questionindex}
                className="rounded-xl border border-gray-200 p-5"
              >
                <h2 className="mb-3 text-lg font-semibold text-gray-800">
                  Q{item.questionindex + 1}. {item.question}
                </h2>

                <p className="mb-2">
                  <span className="font-semibold">Your answer:</span>{" "}
                  {item.selectedOption ?? "Not attempted"}
                </p>

                <p className="mb-2 text-green-700">
                  <span className="font-semibold">Correct answer:</span>{" "}
                  {item.correctAnswer}
                </p>

                <p className="mb-2">
                  <span className="font-semibold">Result:</span>{" "}
                  {item.correct === null
                    ? "Not attempted"
                    : item.correct
                      ? "Correct"
                      : "Incorrect"}
                </p>

                <p className="text-gray-600">
                  <span className="font-semibold">Explanation:</span>{" "}
                  {item.explanation}
                </p>
              </div>
            ))}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={redirection}
                className={`px-6 py-4 rounded-2xl font-semibold ${
                  passed ? "bg-amber-400" : "bg-gray-200"
                }`}
              >
                Back to learning plan
              </button>
              <button
                onClick={reattempt}
                className={`px-6 py-4 rounded-2xl font-semibold ${
                  passed ? "bg-gray-200" : "bg-amber-400"
                }`}
              >
                Reattempt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = data[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8">
        {/* Progress */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {data.length}
          </p>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{
                width: `${((currentQuestion + 1) / data.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              disabled={saving}
              onClick={() => setSelectedOption(option)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                ${
                  selectedOption === option
                    ? "border-green-500 bg-green-100 text-green-700"
                    : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
                }
                disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <span className="font-semibold mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-10">
          <button
            onClick={handleNext}
            disabled={saving || selectedOption === ""}
            className="px-8 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : isLast ? "Submit Quiz" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningQuize;