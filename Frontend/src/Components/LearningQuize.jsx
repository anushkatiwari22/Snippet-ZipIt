import UserContext from "../utils/UserContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/popups";

const LearningQuize = () => {
  const { week } = useParams();
  const { obj } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [checkingProgress , setCheckingProgress] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loadingResult, setLoadingResult] = useState(false);
  const navigate = useNavigate();

const getquize = async () => {
  try {
    const resp = await axios.post("http://localhost:3000/getquize", {
      userid: obj?.userid,
      week: week,
    });

    setData(resp.data.quiz);
    setCurrentQuestion(0);
    setSelectedOption("");
    setDisabled(false);
    setShowResult(false);
    setResults([]);
    setScore(0);
    setTotalQuestions(0);
    setCheckingProgress(false);
  } catch (error) {
    handleError(error.response?.data?.message || "Failed to load quiz");
  }
};

  useEffect(() => {
    if (obj?.userid) {
      getquize();
    }
  }, [obj?.userid, week]);

  const handlecheck = (option) => {
    if (disabled) return;
    setSelectedOption(option);
  };

  const saveoption = async () => {
    if (selectedOption === "") {
      handleError("Select an option first");
      return;
    }

    if (disabled) return;

    try {
      const resp = await axios.post("http://localhost:3000/saveoption", {
        questionIndex: currentQuestion,
        userid: obj?.userid,
        option: selectedOption,
        week: week,
      });

      if (resp.data.success) {
        handleSuccess("Answer saved");
        setDisabled(true);
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Failed to save answer");
    }
  };

  const showresult = async () => {
    try {
      setLoadingResult(true);
      setCheckingProgress(true);

      const resp = await axios.post("http://localhost:3000/showresult", {
        userid: obj?.userid,
        week: week,
      });

      if (resp.data.success) {
        setResults(resp.data.results);
        setScore(resp.data.score);
        setTotalQuestions(resp.data.totalQuestions);
        setShowResult(true);
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Failed to fetch results");
    } finally {
      setCheckingProgress(false);
      setLoadingResult(false);
    }
  };

  
  const reattempt = async()=>{
     try {
      const resp = await axios.post(
        "http://localhost:3000/reattempt",
        {
          userid: obj?.userid,
          week: `Week ${Number(week) + 1}`,
        }
      );

      if (resp.data.success) {
        setCurrentQuestion(0);
        setSelectedOption("");
        setDisabled(false);
        setShowResult(false);
        setResults([]);
        setScore(0);
        setTotalQuestions(0);

        await getquize();
      }
    } catch (error) {
      handleError(
        error.response?.data?.message || "Failed to restart quiz"
      );
    }
  }

useEffect(() => {
  if (!obj?.userid || !week || data.length === 0) return;

  async function getweek() {
    try {
      const resp = await axios.post(
        "http://localhost:3000/getquestion",
        {
          userid: obj.userid,
          week,
        }
      );

      if (resp.data.success) {
        const lastSaved = Number(resp.data.currentQuestion);

        // -1 means no answer has been saved yet.
        const nextQuestion =
          lastSaved === -1
            ? 0
            : Math.min(lastSaved + 1, data.length - 1);
            if(lastSaved == data.length -1){
              await showresult();
            }
            else{
              setCurrentQuestion(nextQuestion);
            }
      }
    } catch (error) {
      console.error(error);
    }
  }

  getweek();
}, [obj?.userid, week, data.length]);

  const redirection = () => {
    navigate("/dashboard/learning-plan");
  };

  if (checkingProgress || data.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }



  // Display results instead of the quiz on the same page
  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Quiz Results
          </h1>

          <p className="mb-8 text-xl font-semibold text-green-700">
            Score: {score}/{totalQuestions}
          </p>

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
            <button
              onClick={redirection}
              className="bg-amber-400 p-4 rounded-2xl w-35"
            >
              Next
            </button>
              <button
              onClick={reattempt}
              className="bg-amber-400 p-4 rounded-2xl w-35"
            >
              Reattempt
            </button>
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
              disabled={disabled}
              onClick={() => handlecheck(option)}
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

        {/* Navigation */}
        <div className="flex justify-between mt-10 gap-3">
          <button
            disabled={currentQuestion === 0}
            onClick={() => {
              setCurrentQuestion((prev) => prev - 1);
              setSelectedOption("");
              setDisabled(false);
            }}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={saveoption}
            disabled={disabled || selectedOption === ""}
            className="px-6 py-2 rounded-lg bg-pink-200 hover:bg-pink-300 disabled:opacity-50"
          >
            Save
          </button>

          {currentQuestion === data.length - 1 ? (
            <button
              className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
              onClick={showresult}
              disabled={loadingResult}
            >
              {loadingResult ? "Loading..." : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentQuestion((prev) => prev + 1);
                setSelectedOption("");
                setDisabled(false);
              }}
              className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningQuize;
