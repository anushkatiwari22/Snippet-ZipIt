import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF7EF] p-6 text-center">
      <div
        className="flex items-center justify-center gap-2 md:gap-4 font-extrabold text-neutral-900 leading-none select-none"
        aria-hidden="true"
      >
        <span className="text-[7rem] md:text-[11rem]">4</span>
        <span className="relative w-28 h-28 md:w-44 md:h-44 rounded-[50%_50%_45%_55%/55%_45%_55%_45%] bg-[#F4A6C4] flex items-center justify-center">
          <span className="absolute -right-3 -top-3 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#F7C56C]" />
          <span className="relative text-[5rem] md:text-[8rem]">0</span>
        </span>
        <span className="text-[7rem] md:text-[11rem]">4</span>
      </div>

      <h1 className="mt-8 text-3xl md:text-4xl font-extrabold text-neutral-900">
        This page doesn't exist
      </h1>

      <p className="mt-3 max-w-md text-neutral-600 text-lg">
        The link may be mistyped or the page may have moved. Head back to your
        learning plan to pick up where you left off.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          className="px-6 py-3 rounded-full bg-[#AEB86C] text-white font-semibold hover:bg-[#9ea75c]"
          onClick={() => navigate("/dashboard/home", { replace: true })}
        >
          Go to dashboard
        </button>
        <button
          className="px-6 py-3 rounded-full bg-white text-neutral-900 font-semibold hover:bg-neutral-100"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    </div>
  );
}