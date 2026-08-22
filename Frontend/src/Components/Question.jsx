import { useState } from "react";
import questions from "../utils/questions";
import { useNavigate } from "react-router-dom";

const Question = () => {
  const [currQuestion, setCurrQuestion] = useState(0);
  const [data, setData] = useState({});
  const [optionArray, setOptionArray] = useState([]);

  const naviagte = useNavigate();

  const handleData = () => {
    setData((prev) => ({
      ...prev,
      [questions[currQuestion].question]: optionArray,
    }));

    
  };

  const sendQuestionToDB = async () => {
    const response = await fetch("http://localhost:3000/questioninfo",{
      "method" : "POST",
      "headers" : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(data)
    });

    if(response.ok) {
      naviagte("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#fdf2ef] via-[#fdf6f3] to-[#f6eef5]">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#2d2a3a] mb-6">
        Sol<span className="text-[#e8a0c4]">vi</span>
      </h2>
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 md:p-8 shadow-2xl shadow-[#e8a0c4]/20 border border-[#f3d9e6]">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wide uppercase text-[#e8a0c4]">
              Question {currQuestion + 1}
            </span>

            <span className="text-xs font-medium tracking-wide uppercase text-[#2d2a3a]/40">
              of {questions.length}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-[#f6dce8] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#e8a0c4] transition-all duration-500 ease-out"
              style={{
                width: `${((currQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight leading-snug text-[#2d2a3a]">
            {questions[currQuestion].question}
          </h1>

          <p className="text-[#2d2a3a]/50 text-sm mt-3">
            pick what feels most true for you, We'll tailor your guidance around
            it
          </p>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          {questions[currQuestion].options.map((option, index) => {
            const isSelected = optionArray.includes(option);
            return (
              <button
                key={index}
                value={option}
                onClick={(e) => {
                  const value = e.currentTarget.value;
                  if(optionArray.includes(value)) {
                    setOptionArray(prev => prev.filter(option => option != value));
                  } else{
                    setOptionArray((prev) => [...prev, value]);
                  }

                }}
                className={`group w-full max-w-md rounded-2xl border px-5 py-3 text-left font-medium shadow-sm transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] cursor-pointer ${
                  isSelected
                    ? "border-[#f3d38a] bg-[#fdf0c8] text-[#2d2a3a] shadow-lg shadow-[#f3d38a]/40"
                    : "border-[#f3d9e6] bg-white text-[#2d2a3a] hover:border-[#e8a0c4] hover:bg-[#fdf2ef] hover:shadow-lg hover:shadow-[#e8a0c4]/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-8">
          {currQuestion !== 0 ? (
            <button
              onClick={() => {
                setCurrQuestion((prev) => prev - 1);
              }}
              className="px-5 py-2.5 rounded-full border border-[#f3d9e6] bg-white text-[#2d2a3a]/60 font-semibold hover:bg-[#fdf2ef] hover:border-[#e8a0c4] transition-all cursor-pointer"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {currQuestion === questions.length - 1 ? (
            <button
              onClick={() =>{
                handleData(),
                sendQuestionToDB();
              }}
              className="px-8 py-2.5 rounded-full bg-[#f3d38a] text-[#2d2a3a] font-bold shadow-md shadow-[#f3d38a]/40 hover:shadow-xl hover:shadow-[#f3d38a]/50 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Start My Journey
            </button>
          ) : (
            <button
              onClick={() => {
                handleData();
                setOptionArray([]);
                setCurrQuestion((prev) => prev + 1);
              }}
              className="px-8 py-2.5 rounded-full bg-[#2d2a3a] text-white font-bold shadow-md shadow-[#2d2a3a]/20 hover:shadow-xl hover:shadow-[#2d2a3a]/30 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;