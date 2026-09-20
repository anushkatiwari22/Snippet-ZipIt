import { useRef, useState } from "react";
import axios from "axios";
import Shimmer from "./Shimmer";
import { useContext } from "react";
import UserContext from "../utils/UserContext";
import { useEffect } from "react";
import Lock from "./Lock"

// "technicalSkills" -> "technical Skills" (the "capitalize" class fixes the first letter)
const formatKey = (key) => key.replace(/([a-z])([A-Z])/g, "$1 $2");

// ShowData displays ANY data: text, number, list or object (even nested).
// It calls itself for the inner values, so no matter what shape the API sends,
// every value ends up on the screen and nothing can crash.
const ShowData = ({ data }) => {
  // 1) text, number or boolean -> just show it
  if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return <p className="whitespace-pre-line">{String(data)}</p>;
  }

  // 2) array (list) -> one bullet per item, each item shown with ShowData again
  if (Array.isArray(data)) {
    return (
      <ul className="list-disc space-y-2 pl-5">
        {data.map((item, index) => (
          <li key={index}>
            <ShowData data={item} />
          </li>
        ))}
      </ul>
    );
  }

  // 3) object -> for every key: the key as a small title, then its value with ShowData again
  if (data && typeof data === "object") {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <p className="font-medium capitalize text-[#1C1B2E]">
              {formatKey(key)}
            </p>

            <div className="ml-1 mt-1 border-l-2 border-purple-100 pl-3">
              <ShowData data={value} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // null / undefined -> show nothing
  return null;
};

const ResumeAnalyser = () => {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const { obj, setObj } = useContext(UserContext);

  const [resumeAnalysisCount, setResumeAnalysisCount] = useState(0);


  useEffect(() => {
    if (!obj?.userid) return;

    const getCount = async () => {
      try {
        const response = await axios.post("http://localhost:3000/resumeanalysiscount", {
          userid: obj.userid,
        });
        setResumeAnalysisCount(Number(response?.data?.count ?? 0));
      } catch (error) {
        console.error("Count error:", error);
        setResumeAnalysisCount(0);
      }
    };

    getCount();
  }, [obj?.userid])

  useEffect(() => {
    async function setCount() {
      const response = await axios.post("http://localhost:3000/updateresumeanalysiscount",{
        userid : obj.userid,
        count : resumeAnalysisCount
      })
      console.log(response?.data?.success);
    }
    setCount();
  },[resumeAnalysisCount])


  const fileRef = useRef();

  // runs when the user picks a file
  const handelFileUpload = async (e) => {
    const file = e.target?.files[0]; // first selected file
    if (!file) return; // user cancelled the dialog

    setFileName(file.name);
    setMessage("");
    setLoading(true);

    // send the file as multipart/form-data, backend reads it under the key "pdf"
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/analyze-pdf",
        formData,
      );

      // the analysis object lives at response.data.response
      const responseData = response?.data?.response;
      console.log("API Response:", responseData);

      if (responseData && typeof responseData === "object") {
        setFileData(responseData);
      } else {
        setMessage(
          typeof responseData === "string"
            ? responseData
            : "Could not analyse this file. Please try again.",
        );
      }
      setResumeAnalysisCount(prev => prev + 1);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Something went wrong while uploading. Please try again.");
    } finally {
      setLoading(false); // stop the shimmer whether it worked or failed
    }
  };


  const removeFile = () => {
    setFileData(null);
    setFileName("");
    setMessage("");
    setLoading(false);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // if (resumeAnalysisCount === null) return <Shimmer />; // avoids a flash of the upload UI
  if (resumeAnalysisCount >= 3 && !fileData) return <Lock />;

  return (
    <div className="min-h-full bg-gradient-to-br from-[#fff8fc] via-[#f8f5ff] to-[#fffdf3] px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[#1C1B2E]">
          Resume Analyser
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Get insights and feedback on your resume.
        </p>
      </div>

      {/* Upload Section */}
      <div className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div
          className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50/70 via-pink-50/40 to-yellow-50/40"
          onClick={() => fileRef.current?.click()}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Shimmer />
              <p className="text-sm font-medium text-[#1C1B2E]">
                Analysing your resume...
              </p>
            </div>
          ) : fileData ? (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                ✓
              </div>

              <h2 className="text-lg font-semibold text-[#1C1B2E]">
                Analysis Complete
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your resume {fileName ? `(${fileName})` : ""} has been analysed successfully.
              </p>
            </div>
          ) : (
            <>
              <input
                type="file"
                ref={fileRef}
                accept=".pdf, application/pdf, .doc, .docx"
                onChange={handelFileUpload}
                className="hidden"
              />

              {message && (
                <p className="mb-4 max-w-md rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                  {message}
                </p>
              )}

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                📄
              </div>

              <p className="font-semibold text-[#1C1B2E]">
                Upload your resume
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Click here to upload your PDF
              </p>
            </>
          )}
        </div>

        {fileData && (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#1C1B2E]">
                Resume Analysis
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Here's what Solvi found in your resume.
              </p>
            </div>

            {/* this converts the object values into the array of key value pair and .map() is helping to iterate on it */}
            {Object.entries(fileData).map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm"
              >

                <h3 className="mb-3 text-lg font-semibold capitalize text-[#1C1B2E]">
                  {formatKey(key)}
                </h3>

                <div className="text-sm leading-6 text-slate-600">
                  <ShowData data={value} />
                </div>
              </div>
            ))}

            {/* Remove Button */}
            <div className="flex justify-end">
              <button
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                onClick={removeFile}
              >
                Remove File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
};

export default ResumeAnalyser;