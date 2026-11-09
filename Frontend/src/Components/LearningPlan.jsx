import { BookOpen, Code2, Target, Lock, Check } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import UserContext from "../utils/UserContext";
import { handleError, handleSuccess } from "../utils/popups";
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
  const location = useLocation();
  const [reviewMode, setReviewMode] = useState(Boolean(location.state?.review));
  const dashboardData = useOutletContext();

  const [error, setError] = useState("");
  const weekData = dashboardData?.review?.learningPlan?.[idx];
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
    const newTasks = completedTasks.filter(
      (t) => !progresstasks.includes(t)
    );

    if (newTasks.length === 0) {
      return handleError("Tick at least one new task to save");
    }

    try {
      const resp = await axios.post("http://localhost:3000/saveprogress", {
        userid: obj?.userid,
        week: weekData?.week,
        completedTasks: newTasks,
        allTasks: allTasks,
      });

      const data = resp.data;

      setCompleted(data.completed);
      await getprogress();
      setCompletedTasks([]);
      handleSuccess("Progress saved");
    } catch (error) {
      console.error("Error saving progress:", error);
      handleError("Could not save your progress");
    }
  }

  async function getprogress() {
    const resp = await axios.post("http://localhost:3000/getprogress", {
      userid: obj?.userid,
      week: weekData?.week,
    });

    const data = resp.data;

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
          resp.data.message || "Please complete the quiz first"
        );
      }

      if (resp.data.passed !== true) {
        return handleError(
          resp.data.message || "You haven't passed this week's quiz yet"
        );
      }

      const learningPlan = dashboardData?.review?.learningPlan || [];
      const nextIndex = idx + 1;

      if (nextIndex < learningPlan.length) {
        setIdx(nextIndex);
        setcheckQuize(false);
        setCompleted(false);
        setCompletedTasks([]);
        return;
      }

      setPlanCompleted(true);
    } catch (error) {
      console.error("Error checking quiz:", error);
      handleError("Something went wrong. Please try again.");
    }
  };

  const handleprev = () => {
    if (idx !== 0) {
      setIdx((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const getweek = async () => {
      try {
        if (!obj?.userid) return;

        const learningPlan = dashboardData?.review?.learningPlan;

        if (!Array.isArray(learningPlan) || learningPlan.length === 0) {
          return;
        }

        const resp = await axios.post("http://localhost:3000/getweek", {
          userid: obj.userid,
        });

        const data = resp.data;

        if (!data.currentweek) {
          handleError("Unable to fetch your learning plan");
          return;
        }


        console.log("Complete Learning Plan:", learningPlan);

console.log("Week 2:", learningPlan[1]);
console.log("Week 3:", learningPlan[2]);
console.log("Week 4:", learningPlan[3]);

        const currentWeekIndex = learningPlan.findIndex(
          (week) => week.week.trim() === data.currentweek.trim()
        );

        if (currentWeekIndex === -1) {
          const currentWeekNumber = Number(data.currentweek.split(" ")[1]);
          const lastWeekNumber = Number(
            learningPlan[learningPlan.length - 1].week.split(" ")[1]
          );

          if (
            Number.isFinite(currentWeekNumber) &&
            Number.isFinite(lastWeekNumber) &&
            currentWeekNumber > lastWeekNumber
          ) {
            if (data.quizPassed) {
              if (reviewMode) {
                setPlanCompleted(false);
                setIdx(0);
              } else {
                setPlanCompleted(true);
              }
            } else {
              handleError(
                "Pass the last week's quiz to complete your learning plan"
              );
              setPlanCompleted(false);
              setIdx(learningPlan.length - 1);
            }

            return;
          }

          console.error("Current week not found:", {
            currentweek: data.currentweek,
            availableWeeks: learningPlan.map((week) => week.week),
          });

          return;
        }

        setPlanCompleted(false);

        if (currentWeekIndex > 0 && !data.quizPassed) {
          handleError(
            "Complete the previous week's quiz with more than 5 correct answers"
          );

          setIdx(currentWeekIndex - 1);
          return;
        }

        setIdx(currentWeekIndex);
        setCompleted(false);
        setCompletedTasks([]);
      } catch (error) {
        console.error("Error fetching week:", error);
        handleError("Something went wrong while loading your plan");
      }
    };

    getweek();
  }, [obj?.userid, dashboardData?.review?.learningPlan]);

  useEffect(() => {
    if (!obj?.userid || !weekData?.week) {
      return;
    }

    setCompletedTasks([]);
    getprogress();
  }, [obj?.userid, weekData?.week]);

  const handledisable = (topic) => {
    return (progresstasks || []).includes(topic);
  };

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
          Choose what you want to learn next.
        </p>

        <button
          className="mt-6 bg-green-400 px-8 py-4 rounded-2xl font-semibold"
          onClick={() => {
            navigate("/dashboard/nextmonthplan");
          }}
        >
          Continue Learning
        </button>

        <button
          className="mt-3 bg-white px-8 py-4 rounded-2xl font-semibold hover:bg-neutral-100"
          onClick={() => {
            setReviewMode(true);
            setPlanCompleted(false);
            setIdx(0);
          }}
        >
          Review my plan
        </button>
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
                const topicText =
                  typeof topic === "string"
                    ? topic
                    : topic?.topic ||
                      topic?.title ||
                      topic?.name ||
                      "Untitled topic";

                const isChecked =
                  completedTasks.includes(topicText) ||
                  handledisable(topicText);

                const isDisabled = handledisable(topicText);

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
                      onChange={() => handleCheck(topicText)}
                      disabled={isDisabled}
                    />

                    <span
                      className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
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

                    <p className="text-neutral-900">{topicText}</p>
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
                const activityText =
                  typeof activity === "string"
                    ? activity
                    : activity?.activity ||
                      activity?.title ||
                      activity?.name ||
                      activity?.task ||
                      "Untitled activity";

                const isChecked =
                  completedTasks.includes(activityText) ||
                  handledisable(activityText);

                const isDisabled = handledisable(activityText);

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
                      onChange={() => handleCheck(activityText)}
                      disabled={isDisabled}
                    />

                    <span
                      className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
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

                    <p className="text-neutral-900">{activityText}</p>
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
                idx === 0
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
              onClick={handleprev}
            >
              Previous week
            </button>

            <button
              className="px-5 py-2.5 rounded-full font-semibold transition-colors bg-[#F4A6C4] text-neutral-900 hover:bg-[#f097ba]"
              onClick={handleweek}
            >
              {idx === totalWeeks - 1 ? "Finish plan" : "Next week"}
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