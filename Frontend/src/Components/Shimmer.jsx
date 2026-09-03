const Shimmer = () => {
  const dots = Array.from({ length: 12 });

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-white">
      <div className="relative h-16 w-16">
        {dots.map((_, index) => (
          <div
            key={index}
            className="absolute left-1/2 top-1/2 h-2.5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5B5FEF] spinner-dot"
            style={{
              transform: `rotate(${index * 30}deg) translateY(-24px)`,
              animationDelay: `${index * (1 / 12)}s`,
            }}
          ></div>
        ))}
      </div>
      <div className="text-[#5B5FEF]">please wait</div>

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