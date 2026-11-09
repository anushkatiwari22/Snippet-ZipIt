const Shimmer = () => {
  const dots = Array.from({ length: 12 });

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#FADF6B]">
      <div className="flex flex-col items-center rounded-[28px] bg-[#F7F4E3] px-12 py-10 ring-1 ring-black/5">
        <div className="relative h-16 w-16">
          {dots.map((_, index) => (
            <div
              key={index}
              className="absolute left-1/2 top-1/2 h-2.5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#181818] spinner-dot"
              style={{
                transform: `rotate(${index * 30}deg) translateY(-24px)`,
                animationDelay: `${index * (1 / 12)}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="mt-5 text-sm font-semibold text-[#1C1B2E]">please wait</div>
      </div>

      <style>{`
        .spinner-dot {
          animation: dotFade 1.2s linear infinite;
        }
        @keyframes dotFade {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};

export default Shimmer;