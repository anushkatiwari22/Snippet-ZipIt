import { useContext } from "react";
import { useOutletContext } from "react-router-dom";
import UserContext from "../utils/UserContext";
import Shimmer from "./Shimmer";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const qoutes = [
  "It's a hit, if it made your eyes lit 🔥",
  "Consistency is the new cool ❤️‍🔥",
  "It's a good day, if your code worked 😉",
  "Loving the way you code is the coder's compliment 😍",
  "Could I be Any More Coder 😎",
  "One bug down, confidence up 😌",
  "Trust the process, debug the rest 🐛✨",
  "Your code doesn't have to be perfect, just persistent 💻❤️",
  "A little progress is still a big deal 🌱",
  "Keep coding, future you is watching 👀",
  "You're one commit closer 🚀",
  "Plot twist: you actually know what you're doing 😏",
  "Less overthinking, more executing 💅",
  "Code. Break. Fix. Repeat. 🔁",
  "Your only competition is yesterday's version of you ✨",
  "Errors are just code asking for attention 👀",
  "Good things take time. Great code takes debugging 😭",
  "You didn't come this far to stop at one bug 🫶",
  "Keep going, the 'it finally works' moment is coming 💻✨",
  "Debugging is just detective work with semicolons 🕵️‍♀️",
  "Your future self will thank you for today's effort 💗",
  "Dream big. Code bigger. 🚀",
  "Small commits, big dreams 🌷",
  "Don't rush the glow-up, ship the progress ✨",
  "You're doing better than your last error message suggests 😭",
  "Ctrl + S your progress, not your dreams 💾💗",
  "Main character energy, developer edition 💻👑",
  "Romanticize the process, even the debugging part 🎀",
  "Be patient. Your breakthrough is compiling ⏳✨",
];

const C = {
  yellow: "#FADF6B",
  pink: "#F6A9CB",
  blue: "#A9C7F2",
  green: "#A3B676",
  cream: "#F6F4E4",
  ink: "#17171A",
};

const HAIR = "rgba(23,23,26,0.1)";
const ROW_BG = "rgba(23,23,26,0.045)";
const GLASS = "rgba(255,255,255,0.35)";

/* ---------- icons ---------- */
const Icon = ({ children, className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const TargetIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" />
  </Icon>
);
const BarsIcon = () => (
  <Icon>
    <path d="M5 20v-7M12 20V5M19 20v-10" />
  </Icon>
);
const ClockIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);
const SparkIcon = () => (
  <Icon>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
  </Icon>
);
const CompassIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </Icon>
);
const FlagIcon = () => (
  <Icon>
    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
  </Icon>
);
const CheckIcon = () => (
  <Icon className="h-4 w-4">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);
const UpIcon = () => (
  <Icon className="h-4 w-4">
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Icon>
);

/* ---------- building blocks ---------- */

const Sticker = ({ color, className = "" }) => (
  <div className={`absolute ${className}`}>
    {[0, 30, 60].map((deg) => (
      <div
        key={deg}
        className="absolute inset-0 rounded-[28%]"
        style={{ backgroundColor: color, transform: `rotate(${deg}deg)` }}
      />
    ))}
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="mb-3 text-sm font-semibold" style={{ opacity: 0.55 }}>
    {children}
  </p>
);

// coloured stat tile: icon in a glassy square + big value + label
const StatTile = ({ icon, color, dark = false, value, label }) => (
  <div
    className="flex min-w-0 items-center gap-4 rounded-2xl p-4"
    style={{ backgroundColor: color, color: dark ? C.yellow : C.ink }}
  >
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
      style={{ backgroundColor: dark ? "rgba(250,223,107,0.15)" : GLASS }}
    >
      {icon}
    </span>
    <div className="min-w-0">
      <p className="font-display line-clamp-2 text-lg font-extrabold leading-tight">
        {value}
      </p>
      <p className="mt-0.5 text-xs font-semibold" style={{ opacity: 0.7 }}>
        {label}
      </p>
    </div>
  </div>
);

// list row: coloured square on the left, text in the middle, optional tag on the right
const ListRow = ({ lead, color, title, text, tag }) => (
  <div
    className="flex items-center gap-4 rounded-2xl p-4"
    style={{ backgroundColor: ROW_BG }}
  >
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold"
      style={{ backgroundColor: color, color: C.ink }}
    >
      {lead}
    </span>
    <div className="min-w-0 flex-1">
      <p className={`font-display text-sm font-extrabold leading-5 ${text ? "line-clamp-1" : "line-clamp-3"}`}>
        {title}
      </p>
      {text && (
        <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-5" style={{ opacity: 0.7 }}>
          {text}
        </p>
      )}
    </div>
    {tag && (
      <span
        className="hidden shrink-0 rounded-full px-3 py-1 text-xs font-bold sm:inline-block"
        style={{ backgroundColor: C.ink, color: C.yellow }}
      >
        {tag}
      </span>
    )}
  </div>
);



const DashboardOverview = () => {
  const outletData = useOutletContext();
  const { obj } = useContext(UserContext);
  const data = outletData?.review;
  const username = obj?.username;

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const qoutesInterval = setInterval(() => {
      setIdx((prev) => (prev + 1) % qoutes.length);
    }, 5000);

    return () => {
      clearInterval(qoutesInterval);
    };
  }, []);

  if (!data) return <Shimmer />;

  const profile = data.careerProfile;
  const final = data.finalAssessment;
  const focus = data.focusArea;
  const strengths = (data.careerAssessment?.strengths || []).slice(0, 2);
  const gaps = (data.careerAssessment?.skillGaps || []).slice(0, 2);
  const steps = (final?.topPriorities || []).slice(0, 3);

  return (
    <div className="min-h-full p-4 sm:p-6" style={{ backgroundColor: C.yellow, color: C.ink }}>
      <style>{`
        @keyframes vibeFill { from { width: 0% } to { width: 100% } }
        @media (prefers-reduced-motion: reduce) { .vibe-bar { animation: none !important; width: 100% } }
      `}</style>

      {/* the big rounded "sheet" that holds the whole dashboard */}
      <div
        className="mx-auto max-w-6xl rounded-[2rem] p-6 sm:p-8"
        style={{
          backgroundColor: C.cream,
          boxShadow: "0 24px 50px -28px rgba(23,23,26,0.45)",
        }}
      >
        {/* top bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-extrabold">Dashboard</h1>
            <p className="text-xs font-semibold" style={{ opacity: 0.55 }}>
              Your career at a glance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-bold sm:block">{username}</span>
            {
              
            }
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold"
              style={{ backgroundColor: C.ink, color: C.yellow }}
            >
              {username?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* greeting banner */}
        <div
          className="relative mt-6 overflow-hidden rounded-3xl p-7 sm:p-9"
          style={{ backgroundColor: C.pink }}
        >
          <div className="relative z-10 max-w-md">
            <h2 className="font-display text-4xl font-extrabold tracking-tight">
              Hi, {username}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm font-medium leading-6">
              {final?.message || "Ready to start your day?"}
            </p>
          </div>

          {/* decorative cluster built from the Solvi shapes */}
          <div className="pointer-events-none absolute right-6 top-1/2 hidden h-44 w-64 -translate-y-1/2 md:block" aria-hidden="true">
            <Sticker color={C.yellow} className="right-6 top-2 h-28 w-28 rotate-12" />
            <Sticker color={C.blue} className="right-28 top-16 h-20 w-20 -rotate-6" />
            <div className="absolute bottom-3 right-2 h-14 w-14 rotate-12 rounded-2xl" style={{ backgroundColor: C.green }} />
            <div className="absolute right-24 top-3 h-4 w-4 rounded-full" style={{ backgroundColor: C.ink }} />
            <div className="absolute right-12 top-12 flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: C.ink, color: C.yellow }}>
              <TargetIcon />
            </div>
          </div>
        </div>

        {/* overview tiles */}
        <div className="mt-8">
          <SectionLabel>Overview</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile dark color={C.ink} icon={<TargetIcon />} value={profile?.targetRole} label="Target role" />
            <StatTile color={C.pink} icon={<BarsIcon />} value={profile?.experienceLevel} label="Experience" />
            <StatTile color={C.green} icon={<ClockIcon />} value={profile?.dailyTime} label="Time per day" />
            <StatTile color={C.blue} icon={<SparkIcon />} value={profile?.learningPreference} label="Learning style" />
          </div>
        </div>

        {/* vibe check */}
        <div
          className="relative mt-6 flex items-center gap-4 overflow-hidden rounded-2xl p-4"
          style={{ backgroundColor: ROW_BG }}
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: C.yellow }}
          >
            <SparkIcon />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold" style={{ opacity: 0.55 }}>
              Solvi's vibe check
            </p>
            <p key={idx} className="font-display truncate text-sm font-extrabold sm:text-base">
              {qoutes[idx]}
            </p>
          </div>
        </div>

        {/* plan: focus + readiness, and next steps */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <SectionLabel>Where you stand</SectionLabel>
            <div className="space-y-3">
              <ListRow
                lead={<CompassIcon />}
                color={C.blue}
                title={focus?.area}
                text={focus?.whyItMatters}
                tag="Focus first"
              />
              <ListRow
                lead={<FlagIcon />}
                color={C.green}
                title="Readiness"
                text={final?.readinessLevel}
              />
            </div>
          </div>

          {steps.length > 0 && (
            <div>
              <SectionLabel>Next steps</SectionLabel>
              <div className="space-y-3">
                {steps.map((t, i) => (
                  <ListRow
                    key={i}
                    lead={i + 1}
                    color={[C.pink, C.yellow, C.blue][i % 3]}
                    title={t}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* skills */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <SectionLabel>What's working</SectionLabel>
            <div className="space-y-3">
              {strengths.map((t, i) => (
                <ListRow key={i} lead={<CheckIcon />} color={C.green} title={t} />
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>What to improve</SectionLabel>
            <div className="space-y-3">
              {gaps.map((t, i) => (
                <ListRow key={i} lead={<UpIcon />} color={C.pink} title={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;