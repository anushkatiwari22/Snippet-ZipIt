import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import UserContext from "../utils/UserContext";
import Lock from "./Lock";

// Same theme as the Lock page and sidebar
const C = {
  yellow: "#FADF6B",
  pink: "#F6A9CB",
  blue: "#A9C7F2",
  green: "#A3B676",
  cream: "#F6F4E4",
  ink: "#17171A",
};

// result cards cycle through these colours
const cardColors = [C.pink, C.blue, C.green, C.cream];

const FREE_LIMIT = 3; // only used for the "free analyses left" card. Your `>= 3` check below decides the Lock

const steps = [
  { title: "Upload", text: "Pick your resume as a PDF.", color: C.pink },
  {
    title: "We read it",
    text: "Solvi goes through your skills, experience and layout.",
    color: C.blue,
  },
  {
    title: "Get feedback",
    text: "Your analysis shows up right on this page.",
    color: C.green,
  },
];

const tips = [
  "Use a PDF exported from Word or Google Docs",
  "Keep it to one or two pages",
  "Upload your latest version",
];

// "technicalSkills" -> "technical Skills" (the "capitalize" class fixes the first letter)
const formatKey = (key) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\bats\b/gi, "ATS");

/* ---------- icons ---------- */
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 16V5M7 10l5-5 5 5M5 19h14" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
  </svg>
);

const SmallCheckIcon = () => (
  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
  </svg>
);

const DocIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5M10 13h6M10 17h6" />
  </svg>
);

/* ---------- loader (fixed size, so the box never grows) ---------- */
const Flower = ({ spin = false }) => (
  <div className="relative h-20 w-20 shrink-0" style={{ color: C.ink }}>
    <div
      className={`absolute inset-0 ${
        spin ? "animate-spin motion-reduce:animate-none" : ""
      }`}
      style={spin ? { animationDuration: "6s" } : undefined}
    >
      {[0, 30, 60].map((deg) => (
        <div
          key={deg}
          className="absolute inset-0 rounded-[28%]"
          style={{ backgroundColor: C.pink, transform: `rotate(${deg}deg)` }}
        />
      ))}
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <DocIcon />
    </div>
  </div>
);

const Loader = () => (
  <div className="flex flex-col items-center gap-4 text-center">
    <Flower spin />

    <div>
      <p className="text-base font-bold">Analysing your resume</p>
      <p className="mt-1 text-sm" style={{ opacity: 0.6 }}>
        Hang tight, we're reading it now.
      </p>
    </div>

    <div className="flex gap-1.5" aria-hidden="true">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 animate-bounce rounded-full motion-reduce:animate-none"
          style={{ backgroundColor: C.ink, animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
);

/* ---------- analysis view ----------
   The API can send any shape, so this looks for the useful bits
   (a score, a summary) and shows everything else in short, tidy pieces:
   one tab per section, chips for short lists, "show more" for long ones. */

const SOFT = "rgba(255,255,255,0.65)";
const ringStyle = { "--tw-ring-color": "currentColor" };

const SCORE_RE = /score|rating|ats|match/i;
const METER_RE = /score|rating|match|level|percent|proficiency/i;
const SUMMARY_RE = /summary|overview|headline|about/i;
const TITLE_RE =
  /^(title|name|role|position|company|degree|project|skill|category|area|heading)$/i;

const isEmpty = (v) =>
  v == null ||
  v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);

const isShort = (v) => typeof v === "string" && v.length <= 32;

// 78, "78", "78%" and "78/100" all count as numbers
const toNumber = (v) => {
  if (typeof v === "number") return v;
  if (
    typeof v === "string" &&
    /^\s*\d{1,3}(\.\d+)?\s*(%|\/\s*\d+)?\s*$/.test(v)
  ) {
    return parseFloat(v);
  }
  return null;
};

const maxOf = (n) => (n <= 10 ? 10 : 100); // 0-10 or 0-100 scale
const toPct = (n) => Math.min(100, Math.max(0, (n / maxOf(n)) * 100));

const isAts = (k) => /^ats|\bats\b/i.test(formatKey(k));

const parseAnalysis = (data) => {
  const entries = Object.entries(data).filter(([, v]) => !isEmpty(v));
  const used = new Set();
  let score = null;
  let summary = null;

  const top = (pred) =>
    entries.find(([k, v]) => pred(k) && toNumber(v) !== null);

  // a number sitting inside an object, e.g. { atsCompatibility: { score: 85 } }
  const nested = (pred) => {
    for (const [pk, pv] of entries) {
      if (pred(pk) && pv && typeof pv === "object" && !Array.isArray(pv)) {
        const hit = Object.entries(pv).find(
          ([ik, iv]) => SCORE_RE.test(ik) && toNumber(iv) !== null,
        );
        if (hit) return { pk, value: toNumber(hit[1]) };
      }
    }
    return null;
  };

  // priority: ATS number -> number inside an ATS object -> any score -> any nested score
  const atsTop = top(isAts);
  const atsNested = atsTop ? null : nested(isAts);
  const anyTop = atsTop || atsNested ? null : top((k) => SCORE_RE.test(k));
  const anyNested = atsTop || atsNested || anyTop ? null : nested(() => true);

  if (atsTop || anyTop) {
    const [k, v] = atsTop || anyTop;
    score = { label: formatKey(k), value: toNumber(v) };
    used.add(k);
  } else if (atsNested || anyNested) {
    const n = atsNested || anyNested;
    score = { label: formatKey(n.pk), value: n.value };
  }

  const sumEntry = entries.find(
    ([k, v]) => !used.has(k) && SUMMARY_RE.test(k) && typeof v === "string",
  );
  if (sumEntry) {
    summary = sumEntry[1];
    used.add(sumEntry[0]);
  }

  const rest = entries.filter(([k]) => !used.has(k));
  const basics = rest.filter(([, v]) => typeof v !== "object");
  const groups = rest.filter(([, v]) => typeof v === "object");

  const sections = [];
  if (basics.length) {
    sections.push({
      key: "__details",
      label: "Details",
      value: Object.fromEntries(basics),
    });
  }
  groups.forEach(([k, v]) =>
    sections.push({ key: k, label: formatKey(k), value: v }),
  );

  return { score, summary, sections };
};

const ToggleButton = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="mt-3 rounded text-sm font-bold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2"
    style={ringStyle}
  >
    {children}
  </button>
);

// long text is cut short with a "Read more" button
const Text = ({ text, limit = 240 }) => {
  const [open, setOpen] = useState(false);
  const long = text.length > limit;
  const shown = long && !open ? text.slice(0, limit).trimEnd() + "…" : text;

  return (
    <div>
      <p className="whitespace-pre-line text-sm font-medium leading-6">
        {shown}
      </p>
      {long && (
        <ToggleButton onClick={() => setOpen((o) => !o)}>
          {open ? "Show less" : "Read more"}
        </ToggleButton>
      )}
    </div>
  );
};

// shows the first few items, hides the rest behind "Show N more"
const ExpandList = ({ items, step = 4, render, className = "space-y-2" }) => {
  const [open, setOpen] = useState(false);
  const shown = open ? items : items.slice(0, step);
  const hidden = items.length - step;

  return (
    <div>
      <div className={className}>
        {shown.map((item, i) => (
          <div key={i}>{render(item, i)}</div>
        ))}
      </div>
      {hidden > 0 && (
        <ToggleButton onClick={() => setOpen((o) => !o)}>
          {open ? "Show less" : `Show ${hidden} more`}
        </ToggleButton>
      )}
    </div>
  );
};

// little coloured shapes that cycle through the palette
const dotRing = "0 0 0 1.5px rgba(23,23,26,0.25)";

const Chip = ({ children, i }) => (
  <span
    className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold"
    style={{ backgroundColor: SOFT }}
  >
    {i !== undefined && (
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{
          backgroundColor: cardColors[i % cardColors.length],
          boxShadow: dotRing,
        }}
      />
    )}
    {children}
  </span>
);

// 12-point flower sticker
const Sticker = ({ color, className = "", children }) => (
  <div className={`relative ${className}`}>
    {[0, 30, 60].map((deg) => (
      <div
        key={deg}
        className="absolute inset-0 rounded-[28%]"
        style={{ backgroundColor: color, transform: `rotate(${deg}deg)` }}
      />
    ))}
    <div
      className="font-display relative flex h-full w-full items-center justify-center font-extrabold"
      style={{ color: C.ink }}
    >
      {children}
    </div>
  </div>
);

const Card = ({ children }) => (
  <div className="rounded-2xl p-4" style={{ backgroundColor: SOFT }}>
    {children}
  </div>
);

const Row = ({ text, i = 0 }) => (
  <div
    className="flex gap-3 rounded-2xl px-4 py-3"
    style={{ backgroundColor: SOFT }}
  >
    <span
      className="mt-1.5 h-3 w-3 shrink-0 rotate-45 rounded-[3px]"
      style={{
        backgroundColor: cardColors[i % cardColors.length],
        boxShadow: dotRing,
      }}
    />
    <Text text={text} limit={160} />
  </div>
);

const Meter = ({ value }) => {
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
          <circle cx="20" cy="20" r={r} fill="none" strokeWidth="5" stroke="rgba(23,23,26,0.15)" />
          <circle
            cx="20"
            cy="20"
            r={r}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            stroke={C.ink}
            strokeDasharray={`${(toPct(value) / 100) * c} ${c}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-sm font-semibold" style={{ opacity: 0.7 }}>
        out of {maxOf(value)}
      </span>
    </div>
  );
};

// picks the best way to show any value
const Value = ({ value, name = "" }) => {
  if (isEmpty(value)) return null;

  if (typeof value === "boolean") return <Chip>{value ? "Yes" : "No"}</Chip>;

  const num = METER_RE.test(name) ? toNumber(value) : null;
  if (num !== null) return <Meter value={num} />;

  if (typeof value === "number") {
    return <p className="font-display text-2xl font-extrabold">{value}</p>;
  }
  if (typeof value === "string") return <Text text={value} />;

  if (Array.isArray(value)) {
    // short words -> chips
    if (value.every(isShort)) {
      return (
        <ExpandList
          items={value}
          step={12}
          className="flex flex-wrap gap-2"
          render={(t, i) => <Chip i={i}>{t}</Chip>}
        />
      );
    }
    // sentences -> rows
    if (value.every((v) => typeof v === "string")) {
      return (
        <ExpandList
          items={value}
          step={4}
          render={(t, i) => <Row text={t} i={i} />}
        />
      );
    }
    // objects (jobs, projects...) -> cards
    return (
      <ExpandList
        items={value}
        step={3}
        render={(item) => (
          <Card>
            <Value value={item} />
          </Card>
        )}
      />
    );
  }

  return <ObjectView data={value} />;
};

const ObjectView = ({ data }) => {
  const entries = Object.entries(data).filter(([, v]) => !isEmpty(v));
  const titleEntry = entries.find(
    ([k, v]) => TITLE_RE.test(k) && typeof v === "string",
  );
  const rest = entries.filter((e) => e !== titleEntry);

  return (
    <div className="space-y-4">
      {titleEntry && (
        <p className="font-display text-lg font-bold">{titleEntry[1]}</p>
      )}
      {rest.map(([k, v]) => (
        <div key={k}>
          <p
            className="mb-1.5 text-xs font-bold capitalize"
            style={{ opacity: 0.65 }}
          >
            {formatKey(k)}
          </p>
          <Value value={v} name={k} />
        </div>
      ))}
    </div>
  );
};

const verdict = (pct) =>
  pct >= 80
    ? "Looking strong"
    : pct >= 60
      ? "Solid, with room to grow"
      : "Lots of room to grow";

// ring colour follows the score: green = great, yellow = ok, pink = needs work
const ringColor = (pct) => (pct >= 80 ? C.green : pct >= 60 ? C.yellow : C.pink);

const ScoreCircle = ({ score }) => {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = toPct(score.value);
  const max = maxOf(score.value);

  return (
    <div
      className="relative h-48 w-48 shrink-0"
      role="img"
      aria-label={`${score.label}: ${score.value} out of ${max}`}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="10"
          stroke="rgba(246,244,228,0.15)"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke={ringColor(pct)}
          strokeDasharray={`${(pct / 100) * c} ${c}`}
        />
      </svg>

      <div
        className="absolute flex flex-col items-center justify-center rounded-full"
        style={{ inset: 22, backgroundColor: C.cream, color: C.ink }}
      >
        <span className="font-display text-5xl font-extrabold leading-none">
          {score.value}
        </span>
        <span className="mt-1 text-xs font-bold" style={{ opacity: 0.6 }}>
          out of {max}
        </span>
      </div>

      {/* shapes around the circle */}
      <Sticker color={C.blue} className="absolute -right-4 -top-3 h-14 w-14 rotate-12" />
      <div
        className="absolute -bottom-2 -left-3 h-10 w-10 rotate-12 rounded-xl"
        style={{ backgroundColor: C.green }}
      />
      <div
        className="absolute left-1 top-3 h-4 w-4 rounded-full"
        style={{ backgroundColor: C.yellow }}
      />
    </div>
  );
};

const Hero = ({ score, summary, sectionCount }) => {
  const pct = score ? toPct(score.value) : 0;

  return (
    <div
      className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[2rem] p-8 text-center sm:flex-row sm:text-left"
      style={{ backgroundColor: C.ink, color: C.yellow }}
    >
      {/* soft background shapes */}
      <div
        className="pointer-events-none absolute -bottom-12 -right-10 h-44 w-44 rounded-full"
        style={{ backgroundColor: "rgba(250,223,107,0.08)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-8 right-24 h-20 w-20 rotate-12 rounded-3xl"
        style={{ backgroundColor: "rgba(246,169,203,0.12)" }}
        aria-hidden="true"
      />

      <div className="relative">
        {score ? <ScoreCircle score={score} /> : <Flower />}
      </div>

      <div className="relative min-w-0 flex-1">
        <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
          {score ? verdict(pct) : "Your analysis is ready"}
        </h2>

        {score ? (
          <span
            className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold capitalize"
            style={{ backgroundColor: ringColor(pct), color: C.ink }}
          >
            {score.label}
          </span>
        ) : (
          sectionCount > 0 && (
            <p className="mt-1 text-sm font-semibold" style={{ opacity: 0.7 }}>
              {sectionCount} sections to explore below
            </p>
          )
        )}

        {summary && (
          <div className="mt-4" style={{ color: C.cream }}>
            <Text text={summary} limit={220} />
          </div>
        )}
      </div>
    </div>
  );
};

const AnalysisView = ({ data, onRemove }) => {
  const { score, summary, sections } = parseAnalysis(data);
  const [activeKey, setActiveKey] = useState(null);
  const activeIndex = Math.max(
    sections.findIndex((s) => s.key === activeKey),
    0,
  );
  const current = sections[activeIndex];

  return (
    <div className="space-y-6">
      <Hero score={score} summary={summary} sectionCount={sections.length} />

      {current && (
        <>
          <div
            role="tablist"
            aria-label="Analysis sections"
            className="flex flex-wrap gap-2"
          >
            {sections.map((s, i) => {
              const active = i === activeIndex;
              const count = Array.isArray(s.value) ? s.value.length : null;
              return (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveKey(s.key)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    active ? "" : "hover:brightness-95"
                  }`}
                  style={{
                    backgroundColor: active ? C.ink : C.cream,
                    color: active ? C.yellow : C.ink,
                    "--tw-ring-color": C.ink,
                    "--tw-ring-offset-color": C.yellow,
                  }}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: cardColors[i % cardColors.length],
                      boxShadow: dotRing,
                    }}
                  />
                  {s.label}
                  {count !== null && (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-bold"
                      style={{
                        backgroundColor: active
                          ? "rgba(250,223,107,0.2)"
                          : "rgba(23,23,26,0.1)",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            key={current.key}
            role="tabpanel"
            className="relative rounded-[1.75rem] p-6"
            style={{
              backgroundColor: cardColors[activeIndex % cardColors.length],
            }}
          >
            {Array.isArray(current.value) && (
              <Sticker
                color={cardColors[(activeIndex + 1) % cardColors.length]}
                className="absolute -right-3 -top-5 h-16 w-16 rotate-12 text-xl"
              >
                {current.value.length}
              </Sticker>
            )}
            <h3 className="font-display mb-4 pr-12 text-2xl font-extrabold capitalize">
              {current.label}
            </h3>
            <Value value={current.value} name={current.key} />
          </div>
        </>
      )}

      {/* Remove Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:!bg-[#F6A9CB] hover:!text-[#17171A] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            backgroundColor: C.ink,
            "--tw-ring-color": C.ink,
            "--tw-ring-offset-color": C.yellow,
          }}
        >
          Remove file
        </button>
      </div>
    </div>
  );
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


  // resets everything so the user can upload a new resume
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

  const triesLeft = Math.max(FREE_LIMIT - resumeAnalysisCount, 0); // display only

  return (
    <div
      className="min-h-full px-6 py-10 sm:py-14"
      style={{ backgroundColor: C.yellow, color: C.ink }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <h1 className="font-display text-center text-5xl font-extrabold leading-[1.02] tracking-tight">
          Resume Analyser
        </h1>
        <p
          className="mt-3 text-center text-base font-medium"
          style={{ opacity: 0.7 }}
        >
          Get insights and feedback on your resume.
        </p>

        <div className="mt-14 grid items-start gap-x-12 gap-y-14 lg:grid-cols-5">
        {/* Upload card: fixed height, so it never changes size */}
        <div className="relative mb-2 mt-4 lg:col-span-3">
          {/* pink peeks out at the top-left, blue at the bottom-right */}
          <div
            className="absolute inset-0 -translate-x-3 -translate-y-4 rotate-3 rounded-[2rem]"
            style={{ backgroundColor: C.pink }}
          />
          <div
            className="absolute inset-0 translate-x-3 translate-y-4 rotate-[2.5deg] rounded-[2rem]"
            style={{ backgroundColor: C.blue }}
          />

          <div
            className="relative rounded-[2rem] p-3"
            style={{ backgroundColor: C.green }}
          >
            <div
              onClick={() => fileRef.current?.click()}
              className="flex h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed px-4 text-center"
              style={{
                backgroundColor: C.cream,
                borderColor: "rgba(23,23,26,0.3)",
              }}
            >
              {loading ? (
                <Loader />
              ) : fileData ? (
                <>
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: C.ink, color: C.yellow }}
                  >
                    <CheckIcon />
                  </div>
                  <h2 className="text-lg font-bold">Analysis complete</h2>
                  <p
                    className="mt-1 max-w-xs truncate text-sm"
                    style={{ opacity: 0.6 }}
                  >
                    {fileName || "Your resume"} is ready below.
                  </p>
                </>
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
                    <p
                      className="mb-4 max-w-sm rounded-2xl px-4 py-2 text-sm font-semibold"
                      style={{ backgroundColor: C.pink }}
                    >
                      {message}
                    </p>
                  )}

                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: C.ink, color: C.yellow }}
                  >
                    <UploadIcon />
                  </div>
                  <p className="text-lg font-bold">Upload your resume</p>
                  <p className="mt-1 text-sm" style={{ opacity: 0.6 }}>
                    Click here to pick your PDF
                  </p>
                </>
              )}
            </div>
          </div>
        </div>


        {/* Side cards */}
        <div className="space-y-4 lg:col-span-2">
          {/* free tries */}
          <div
            className="rounded-[1.75rem] p-6"
            style={{ backgroundColor: C.ink, color: C.yellow }}
          >
            <p className="text-sm font-semibold" style={{ opacity: 0.8 }}>
              Free analyses left
            </p>
            <p className="font-display mt-1 text-5xl font-extrabold tracking-tight">
              {triesLeft}
              <span className="text-xl font-semibold" style={{ opacity: 0.6 }}>
                {" "}
                / {FREE_LIMIT}
              </span>
            </p>
            <div className="mt-4 flex gap-2" aria-hidden="true">
              {Array.from({ length: FREE_LIMIT }).map((_, i) => (
                <span
                  key={i}
                  className="h-2.5 flex-1 rounded-full"
                  style={{
                    backgroundColor:
                      i < triesLeft ? C.yellow : "rgba(250,223,107,0.25)",
                  }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm" style={{ opacity: 0.7 }}>
              Go Premium for unlimited analyses.
            </p>
          </div>

          {/* tips */}
          <div
            className="rounded-[1.75rem] p-6"
            style={{ backgroundColor: C.cream }}
          >
            <h3 className="font-display text-lg font-bold">
              Tips for a better result
            </h3>
            <ul className="mt-4 space-y-3">
              {tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 text-sm font-medium leading-5"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: C.green }}
                  >
                    <SmallCheckIcon />
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>

        {/* How it works */}
        {!fileData && (
          <div className="mt-16">
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              How it works
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="rounded-[1.75rem] p-6"
                  style={{ backgroundColor: step.color }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: C.ink, color: C.yellow }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-display mt-4 text-xl font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium leading-6">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {fileData && (
          <div className="mx-auto mt-20 max-w-3xl">
            <AnalysisView data={fileData} onRemove={removeFile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyser;