import { BookOpen, Code2, Target, Lock, Check } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import UserContext from "../utils/UserContext";
import { useContext } from "react";
import { handleError } from "../utils/popups";
import axios from "axios";

export default function Learning() {
  const navigate = useNavigate();
  const { obj, setObj } = useContext(UserContext);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [idx, setIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [progresstasks, setProgresstasks] = useState([]);
  const [checkQuize, setcheckQuize] = useState(false);
  const [planCompleted, setPlanCompleted] = useState(false);
  const dashboardData = useOutletContext();

  const weekData = dashboardData?.review?.learningPlan[idx];
  const totalWeeks = dashboardData?.review?.learningPlan?.length;

  const allTasks = [
    ...(weekData?.topics || []),
    ...(weekData?.practiceActivities || []),
  ];

  const handleCheck = async (task) => {
    setCompletedTasks((prevTasks) => {
      if (!prevTasks.includes(task)) {
        return [...prevTasks, task];
      }

      return prevTasks.filter((t) => t !== task);
    });
  };

  async function saveprogress() {
    const resp = await fetch("http://localhost:3000/saveprogress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid: obj?.userid,
        week: weekData?.week,
        completedTasks: completedTasks,
        allTasks: allTasks,
      }),
    });
    const data = await resp.json();
    setCompleted(data.completed);
  }

  async function getprogress() {
    const resp = await fetch("http://localhost:3000/getprogress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid: obj?.userid,
        week: weekData?.week,
      }),
    });

    const data = await resp.json();
    setProgresstasks(data.tasks || []);
    setCompleted(data.completed);
  }

  const handleweek = async () => {
    try {
      if (!completed) {
        return handleError("Please complete this week first");
      }

      const resp = await axios.post("http://localhost:3000/checkquize", {
        userid: obj?.userid,
        week: weekData?.week,
      });

      if (resp.data.success === false) {
        return handleError(
          resp.data.message || "Please complete the quiz first",
        );
      }

      if (resp.data.passed !== true) {
        return handleError(
          resp.data.message || "You need at least 5 correct answers out of 10",
        );
      }

      if (idx < 3) {
        setIdx((prev) => prev + 1);
        setcheckQuize(false);
        setCompleted(false);
        setCompletedTasks([]);
      }
    } catch (error) {
      console.error("Error checking quiz:", error);
      handleError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const getweek = async () => {
      try {
        if (!obj?.userid) return;

        const resp = await fetch("http://localhost:3000/getweek", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: obj.userid,
          }),
        });

        const data = await resp.json();

        if (!resp.ok || !data.currentweek) {
          handleError("Unable to fetch your learning plan");
          return;
        }

        const weekNumber = Number(data.currentweek.split(" ")[1]);
        const planLength = dashboardData?.review?.learningPlan?.length ?? 0;

        if (weekNumber > planLength) {
          setPlanCompleted(true);
          return;
        }

        setPlanCompleted(false);

        if (weekNumber - 1 === idx) return;

        if (weekNumber > 1 && !data.quizPassed) {
          handleError(
            "Complete the previous week's quiz with more than 5 correct answers",
          );
          setIdx(weekNumber - 2);
          return;
        }

        setIdx(weekNumber - 1);
        setCompleted(false);
        setCompletedTasks([]);
      } catch (error) {
        console.error("Error fetching week:", error);
        handleError("Something went wrong while loading your plan");
      }
    };

    getweek();
  }, [obj?.userid]);

  useEffect(() => {
    console.log("useEffect is running");
    if (!obj?.userid || !weekData?.week) {
      return;
    }
    getprogress();
  }, [obj?.userid, weekData?.week]);

  const handledisable = (topic) => {
    return (progresstasks || []).includes(topic);
  };

  // navitage to quize
  const startquize = () => {
    navigate(`/dashboard/learningquize/${idx}`);
  };

  if (planCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF7EF] p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#AEB86C] flex items-center justify-center mb-6">
          <Check size={40} className="text-white" />
        </div>

        <h1 className="text-4xl font-extrabold text-neutral-900 mb-3">
          Plan Completed!
        </h1>

        <p className="text-neutral-600 text-lg max-w-md">
          You've completed all the weeks in your learning plan. Great work!
        </p>
      </div>
    );
  }

  if (!weekData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF7EF] text-lg font-medium text-neutral-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-10 bg-[#FBF7EF]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-6 mb-6">
          <div>
            <span className="inline-block px-5 py-2 rounded-[50%_50%_45%_55%/55%_45%_55%_45%] bg-[#AEB86C] text-white text-sm font-semibold tracking-wide">
              {weekData.week}
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold mt-4 text-neutral-900 leading-[0.95]">
              {weekData.focus}
            </h1>
          </div>
        </div>

        {/* Outcome */}
        <div className="relative overflow-hidden bg-[#F4A6C4] rounded-[2.5rem] p-7 mb-8">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#F7C56C]/70" />
          <div className="relative flex gap-4 items-start">
            <div className="w-12 h-12 shrink-0 rounded-full bg-white/70 flex items-center justify-center">
              <Target className="text-neutral-800" size={22} />
            </div>

            <div>
              <h3 className="text-xl font-bold mb-1 text-neutral-900">
                Expected outcome
              </h3>
              <p className="text-base text-neutral-800">
                {weekData.expectedOutcome}
              </p>
            </div>
          </div>
        </div>

        {/* Two Columns */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Topics */}
          <div className="bg-[#F7C56C] rounded-[2.5rem] overflow-hidden">
            <div className="flex justify-between items-center px-7 pt-7 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                  <BookOpen className="text-neutral-800" size={18} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Topics to learn
                </h2>
              </div>

              <span className="px-3 py-1 rounded-full bg-white/70 text-neutral-800 text-sm font-medium">
                {weekData.topics?.length || 0}
              </span>
            </div>

            <div className="px-5 pb-5 space-y-2.5">
              {(weekData.topics || []).map((topic, index) => {
                const isChecked = completedTasks.includes(topic);
                const isDisabled = handledisable(topic);
                return (
                  <label
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-white/60 ${
                      isDisabled
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer hover:bg-white/80"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isChecked}
                      onChange={() => handleCheck(topic)}
                      disabled={isDisabled}
                    />
                    <span
                      className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-neutral-900 border-neutral-900"
                          : "bg-white border-neutral-400"
                      }`}
                    >
                      {isChecked && (
                        <Check
                          size={14}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    <p className="text-neutral-900">{topic}</p>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-[#A9C9E8] rounded-[2.5rem] overflow-hidden">
            <div className="flex justify-between items-center px-7 pt-7 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                  <Code2 className="text-neutral-800" size={18} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Practice activities
                </h2>
              </div>

              <span className="px-3 py-1 rounded-full bg-white/70 text-neutral-800 text-sm font-medium">
                {weekData.practiceActivities?.length || 0}
              </span>
            </div>

            <div className="px-5 pb-5 space-y-2.5">
              {(weekData.practiceActivities || []).map((activity, index) => {
                const isChecked = completedTasks.includes(activity);
                const isDisabled = handledisable(activity);
                return (
                  <label
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-white/60 ${
                      isDisabled
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer hover:bg-white/80"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isChecked}
                      onChange={() => handleCheck(activity)}
                      disabled={isDisabled}
                    />
                    <span
                      className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-neutral-900 border-neutral-900"
                          : "bg-white border-neutral-400"
                      }`}
                    >
                      {isChecked && (
                        <Check
                          size={14}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    <p className="text-neutral-900">{activity}</p>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-white rounded-[2.5rem] p-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <Lock size={18} className="text-neutral-600" />
            </div>
            {completed ? (
              <button
                className="px-5 py-2 rounded-full bg-neutral-900 text-white font-semibold hover:bg-neutral-800"
                onClick={startquize}
              >
                Start my quiz
              </button>
            ) : (
              <p className="text-neutral-500">
                Complete all tasks to unlock the quiz
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-5 py-2.5 rounded-full font-semibold transition-colors ${
                idx === dashboardData?.review?.learningPlan?.length - 1
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "bg-[#F4A6C4] text-neutral-900 hover:bg-[#f097ba]"
              }`}
              onClick={handleweek}
              disabled={idx === dashboardData?.review?.learningPlan?.length - 1}
            >
              Next week
            </button>
            <button
              className="px-5 py-2.5 rounded-full bg-[#AEB86C] text-white font-semibold hover:bg-[#9ea75c]"
              onClick={saveprogress}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
