import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Check, Lock, RefreshCw, Sparkles, Layers } from "lucide-react";
import UserContext from "../utils/UserContext";
import { handleError, handleSuccess } from "../utils/popups";

const OPTIONS = [
  {
    value: "continue",
    title: "Continue what I was studying",
    text: "Go deeper into the same subject with more advanced topics and projects.",
    icon: RefreshCw,
    color: "bg-[#F7C56C]",
  },
  {
    value: "new",
    title: "Start something new",
    text: "Switch to a different subject and begin from the fundamentals.",
    icon: Sparkles,
    color: "bg-[#A9C9E8]",
  },
  {
    value: "combine",
    title: "Combine both",
    text: "Keep building on your current subject while adding a new one.",
    icon: Layers,
    color: "bg-[#F4A6C4]",
  },
];

export default function NextPlanForm() {
  const navigate = useNavigate();
  const { obj } = useContext(UserContext);

  const [status, setStatus] = useState(null); 
  const [choice, setChoice] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const needsTopic = choice === "new" || choice === "combine";

  useEffect(() => {
    if (!obj?.userid) return;

    const checkStatus = async () => {
      try {
        const resp = await axios.post("http://localhost:3000/nextplanstatus", {
          userid: obj.userid,
        });

        if (!resp.data.planFinished) {
          handleError("Finish your current weeks and quiz first");
          navigate("/dashboard/learning-plan", { replace: true });
          return;
        }

        setStatus(resp.data);
      } catch (error) {
        handleError(
          error.response?.data?.message || "Could not check your plan status"
        );
        navigate("/dashboard/learning-plan", { replace: true });
      }
    };

    checkStatus();
  }, [obj?.userid, navigate]);

  const handleSubmit = async () => {
    if (!choice) return handleError("Choose how you want to continue");
    if (needsTopic && !newTopic.trim()) {
      return handleError("Tell us what new topic you want to learn");
    }
    if (submitting) return;

    try {
      setSubmitting(true);

      const resp = await axios.post("http://localhost:3000/generatenextplan", {
        userid: obj.userid,
        choice,
        newTopic: needsTopic ? newTopic.trim() : "",
        notes: notes.trim(),
      });

      if (resp.data.success) {
        handleSuccess("Your next weeks are ready");
        window.location.assign("/dashboard/learning-plan");
      }
    } catch (error) {
      if (error.response?.data?.paymentRequired) {
        setStatus((prev) => ({ ...prev, paymentRequired: true }));
      } else {
        handleError(
          error.response?.data?.message || "Could not generate your plan"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF7EF] text-lg font-medium text-neutral-500">
        Loading...
      </div>
    );
  }

  if (status.paymentRequired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF7EF] p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F7C56C] flex items-center justify-center mb-6">
          <Lock size={36} className="text-neutral-900" />
        </div>

        <h1 className="text-4xl font-extrabold text-neutral-900 mb-3">
          You've finished your {status.freeWeekLimit} free weeks
        </h1>

        <p className="text-neutral-600 text-lg max-w-md">
          Upgrade to keep going with new four-week plans, quizzes and progress
          tracking.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            className="px-8 py-4 rounded-2xl bg-neutral-900 text-white font-semibold hover:bg-neutral-800"
            onClick={() => navigate("/dashboard/pricing")}
          >
            Upgrade to continue
          </button>
          <button
            className="px-8 py-4 rounded-2xl bg-white text-neutral-900 font-semibold hover:bg-neutral-100"
            onClick={() =>
              navigate("/dashboard/learning-plan", { state: { review: true } })
            }
          >
            Review my plan
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen p-4 md:p-10 bg-[#FBF7EF]">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block px-5 py-2 rounded-[50%_50%_45%_55%/55%_45%_55%_45%] bg-[#AEB86C] text-white text-sm font-semibold">
          Weeks {status.lastWeek + 1} to {status.lastWeek + 4}
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-2 text-neutral-900 leading-tight">
          What should the next four weeks cover?
        </h1>
        <p className="text-neutral-600 mb-8 max-w-xl">
          You finished Week {status.lastWeek}. Pick a direction and we'll build
          the next weeks around it.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8" role="radiogroup">
          {OPTIONS.map(({ value, title, text, icon: Icon, color }) => {
            const selected = choice === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setChoice(value)}
                className={`${color} text-left rounded-[2rem] p-6 border-4 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900/40 ${
                  selected ? "border-neutral-900" : "border-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center">
                    <Icon size={18} className="text-neutral-900" />
                  </span>
                  {selected && (
                    <span className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-neutral-900 mb-1">
                  {title}
                </h2>
                <p className="text-neutral-800 text-sm">{text}</p>
              </button>
            );
          })}
        </div>

        {needsTopic && (
          <div className="bg-white rounded-[2rem] p-6 mb-4">
            <label
              htmlFor="newTopic"
              className="block font-bold text-neutral-900 mb-2"
            >
              {choice === "new"
                ? "What do you want to learn?"
                : "What do you want to add?"}
            </label>
            <input
              id="newTopic"
              type="text"
              maxLength={100}
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g. System design, Docker, Python for data analysis"
              className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 focus:outline-none focus:border-neutral-900"
            />
          </div>
        )}

        {choice && (
          <div className="bg-white rounded-[2rem] p-6 mb-8">
            <label
              htmlFor="notes"
              className="block font-bold text-neutral-900 mb-2"
            >
              Anything else we should know? (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              maxLength={300}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Goals, a deadline, or what felt too easy or too hard so far"
              className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 focus:outline-none focus:border-neutral-900"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting || !choice}
            className="px-8 py-4 rounded-2xl bg-neutral-900 text-white font-semibold hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Building your plan..." : "Generate my next 4 weeks"}
          </button>
          <button
            onClick={() => navigate("/dashboard/learning-plan")}
            disabled={submitting}
            className="px-8 py-4 rounded-2xl bg-white text-neutral-900 font-semibold hover:bg-neutral-100 disabled:opacity-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}