const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFC] px-6 py-16">

      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#5B5FEF] uppercase">
          Our story
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-[#1C1B2E]">
          About Solvi
        </h1>
        <p className="mt-4 text-[#6B6885] text-lg leading-relaxed">
          Your journey, your goals, your mentor  all in one place.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-20 relative">

        {/* connecting line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#E4E2F1] hidden sm:block" />

        {/* Waypoint 1  Mission */}
        <div className="relative pl-0 sm:pl-12 mb-16">
          <span className="hidden sm:block absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#5B5FEF] ring-4 ring-[#EEEDFB]" />
          <p className="text-xs font-semibold tracking-[0.15em] text-[#5B5FEF] uppercase mb-2">
            The mission
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#1C1B2E] mb-4">
            A mentor available whenever you need one
          </h2>
          <p className="text-[#6B6885] leading-7">
            Solvi helps students and aspiring professionals navigate their career
            journey with greater clarity and confidence. From understanding your
            goals and identifying your strengths, to creating a personalised
            learning path  the AI mentor is here to guide you, not just grade you.
          </p>
          <p className="mt-4 text-[#6B6885] leading-7">
            The goal is simple: make career guidance more accessible, more
            personal, and easier to actually follow through on.
          </p>
        </div>

        <div className="relative pl-0 sm:pl-12 mb-16">
          <span className="hidden sm:block absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#5B5FEF] ring-4 ring-[#EEEDFB]" />
          <p className="text-xs font-semibold tracking-[0.15em] text-[#5B5FEF] uppercase mb-2">
            How it started
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#1C1B2E] mb-4">
            One question, one first project
          </h2>
          <p className="text-[#6B6885] leading-7">
            Solvi is <span className="font-semibold text-[#1C1B2E]">Yashi Tiwari</span> and{" "}
            <span className="font-semibold text-[#1C1B2E]">Anushka Tiwari</span>'s
            first collaborative build  started from one question: what if
            students could have a mentor on hand whenever they needed help
            planning their career and learning path?
          </p>
          <p className="mt-4 text-[#6B6885] leading-7">
            Building it together let us combine ideas, learn from each other,
            and turn that question into something people can actually use.
          </p>
        </div>

        <div className="relative pl-0 sm:pl-12 mb-16">
          <span className="hidden sm:block absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#5B5FEF] ring-4 ring-[#EEEDFB]" />
          <p className="text-xs font-semibold tracking-[0.15em] text-[#5B5FEF] uppercase mb-2">
            The team
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#1C1B2E] mb-6">
            Two developers, one project
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-[#ECEAF5] hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#5B5FEF] flex items-center justify-center text-white font-semibold text-lg">
                YT
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-[#1C1B2E]">
                Yashi Tiwari
              </h3>
              <p className="text-sm text-[#5B5FEF] font-medium mt-0.5">Developer</p>
              <p className="mt-3 text-sm text-[#6B6885] leading-6">
                Passionate about building meaningful applications and exploring
                what's possible with AI and modern web technologies.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#ECEAF5] hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF8A65] to-[#EF5B87] flex items-center justify-center text-white font-semibold text-lg">
                AT
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-[#1C1B2E]">
                Anushka Tiwari
              </h3>
              <p className="text-sm text-[#5B5FEF] font-medium mt-0.5">Developer</p>
              <p className="mt-3 text-sm text-[#6B6885] leading-6">
                Passionate about learning, creating, and turning ideas into
                practical, user-friendly digital experiences.
              </p>
            </div>
          </div>
        </div>

        <div className="relative pl-0 sm:pl-12">
          <span className="hidden sm:block absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#FF8A65] ring-4 ring-[#FFEFE9]" />
          <div className="bg-white rounded-2xl border border-[#ECEAF5] px-8 py-10 text-center">
            <p className="font-serif italic text-xl text-[#1C1B2E] leading-relaxed">
              "Built with curiosity, collaboration, and a lot of learning."
            </p>
            <p className="mt-4 text-sm font-medium text-[#6B6885] tracking-wide">
               Yashi &amp; Anushka
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;