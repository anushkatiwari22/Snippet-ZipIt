const C = {
  yellow: "#FADF6B", 
  pink: "#F6A9CB",
  blue: "#A9C7F2",
  green: "#A3B676", 
  row: "#F6F4E4", 
  ink: "#17171A",
};

const defaultFeatures = [
  "Unlimited resume analyses",
  "Feedback on skills, experience and layout",
  "Re-check after every edit",
];

const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4.5" y="10.5" width="15" height="10" rx="3" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7.5 4.5l5.5 5.5-5.5 5.5" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 10h11M11 5l5 5-5 5" />
  </svg>
);

// Props (all optional):
//   onUpgrade -> called when "Go Premium" is clicked (open checkout here)
//   onBack    -> if given, shows a "Maybe later" button
//   price / period / features -> customise the offer
const Lock = ({
  onUpgrade,
  onBack,
  price = "$9",
  period = "month",
  features = defaultFeatures,
}) => (
  <div
    className="flex min-h-full items-center justify-center px-6 py-10"
    style={{ backgroundColor: C.yellow, color: C.ink }}
  >
    <div className="w-full max-w-sm">
      <h2 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight">
        Free try's done
      </h2>
      <p className="mt-2 text-base font-medium" style={{ opacity: 0.7 }}>
        Go Premium, keep the feedback coming.
      </p>

      {/* fanned card stack */}
      <div className="relative mt-10">
        <div
          className="absolute inset-x-3 -top-6 bottom-6 -rotate-6 rounded-[2rem]"
          style={{ backgroundColor: C.pink }}
        />
        <div
          className="absolute inset-x-1 -top-3 bottom-3 rotate-[3deg] rounded-[2rem]"
          style={{ backgroundColor: C.blue }}
        />

        <div
          className="relative rounded-[2rem] p-5 pb-12"
          style={{ backgroundColor: C.green }}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-bold">What you get</p>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: C.ink, color: C.yellow }}
            >
              Premium
            </span>
          </div>

          <ul className="space-y-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold"
                style={{ backgroundColor: C.row }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: C.yellow }}
                >
                  <CheckIcon />
                </span>
                <span className="flex-1">{feature}</span>
                <ChevronIcon />
              </li>
            ))}
          </ul>

          {/* black lock button notched into the card edge */}
          <div
            className="absolute -bottom-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full"
            style={{
              backgroundColor: C.ink,
              color: C.yellow,
              boxShadow: `0 0 0 6px ${C.yellow}`,
            }}
          >
            <LockIcon />
          </div>
        </div>
      </div>

      <div className="mt-14 flex items-center gap-4">
        <p className="flex items-baseline gap-1">
          <span className="font-display text-4xl font-extrabold tracking-tight">
            {price}
          </span>
          <span className="text-sm font-semibold" style={{ opacity: 0.6 }}>
            /{period}
          </span>
        </p>

        <button
          type="button"
          onClick={onUpgrade}
          className="flex flex-1 items-center justify-between rounded-full py-2 pl-6 pr-2 text-base font-semibold transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            backgroundColor: C.ink,
            color: "#fff",
            "--tw-ring-color": C.ink,
            "--tw-ring-offset-color": C.yellow,
          }}
        >
          Go Premium
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: C.pink, color: C.ink }}
          >
            <ArrowIcon />
          </span>
        </button>
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mx-auto mt-4 block rounded-full px-4 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2"
          style={{ opacity: 0.7, "--tw-ring-color": C.ink }}
        >
          Maybe later
        </button>
      )}
    </div>
  </div>
);

export default Lock;