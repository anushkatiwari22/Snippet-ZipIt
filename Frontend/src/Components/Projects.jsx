import { useContext, useState, useEffect } from "react";
import UserContext from "../utils/UserContext";
import { handleError } from "../utils/popups";
import axios from "axios";

// Accent colours from the app theme, cycled per card
const ACCENTS = [
  { bg: "bg-[#F6A9CB]", ring: "ring-[#F6A9CB]" },
  { bg: "bg-[#A9C4F2]", ring: "ring-[#A9C4F2]" },
  { bg: "bg-[#A3B676]", ring: "ring-[#A3B676]" },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [previousCompletedProjects, setPreviousCompletedProjects] = useState([]);
  const { obj } = useContext(UserContext);

  async function getPreviousCompletedProjects() {
    const response = await axios.post("http://localhost:3000/completedprojects", {
      userid: obj?.userid,
    });
    setPreviousCompletedProjects(response?.data?.previousProjects ?? []);
  }

  useEffect(() => {
    async function getCurrentProjects() {
      const response = await axios.post("http://localhost:3000/currentprojects", {
        userid: obj?.userid,
      });

      setProjectData(response?.data?.currentProjects?.projects ?? []);
    }

    async function getSelectedProject() {
      const response = await axios.post("http://localhost:3000/selectedprojects", {
        userid: obj?.userid,
      });
      setSelectedProject(response?.data?.projectsCompleted ?? []);
    }

    if (obj?.userid != undefined) {
      getCurrentProjects();
      getSelectedProject();
      getPreviousCompletedProjects();
    }
  }, [obj?.userid]);

  async function handelselectedProject(title) {
    let arr;
    if (selectedProject.includes(title)) {
      arr = selectedProject.filter((t) => t != title);
    } else arr = [...selectedProject, title];

    setSelectedProject(arr);
    await axios.post("http://localhost:3000/updateselectedprojects", {
      userid: obj?.userid,
      completedProjects: arr,
    });
  }

  // only count ticks that belong to the projects currently on screen
  const total = projectData.length;
  const done = projectData.filter((p) => selectedProject.includes(p?.title)).length;
  const allDone = total > 0 && done === total;

  async function handelNewProjects() {
    if (!allDone) {
      handleError("Complete all the projects");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/newprojects", {
        userid: obj?.userid,
        projectData,
      });

      setProjectData(response?.data?.projects?.projects ?? []);
      setSelectedProject([]);
      getPreviousCompletedProjects();
    } catch (err) {
      console.error(err);
      handleError("Could not load new projects");
    }
  }

  return (
    <div className="min-h-screen bg-[#FADF6B] px-6 pb-16 pt-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight text-[#1C1B2E]">
          Projects
        </h1>
        <p className="mt-3 text-base text-[#1C1B2E]/70">
          Build real things, tick them off, unlock tougher ones.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1fr_340px]">
        {/* Project cards */}
        <div className="flex flex-col gap-5">
          {projectData.map((project, index) => {
            const isSelected = selectedProject.includes(project?.title);
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <div
                key={project?.title}
                onClick={() => handelselectedProject(project?.title)}
                className={`relative cursor-pointer rounded-[28px] bg-[#F7F4E3] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  isSelected ? `ring-4 ${accent.ring}` : "ring-1 ring-black/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-[#1C1B2E] ${accent.bg}`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 pr-10">
                    <h2 className="font-display text-xl font-bold text-[#1C1B2E]">
                      {project?.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#666477]">
                      {project?.description}
                    </p>
                  </div>

                  <div
                    className={`absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                      isSelected
                        ? "border-[#1C1B2E] bg-[#1C1B2E] text-[#FADF6B]"
                        : "border-dashed border-[#A3B676] text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#1C1B2E]/50">
                      Skills developed
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project?.skillsDeveloped?.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#F6A9CB]/40 px-3 py-1 text-xs font-medium text-[#1C1B2E]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#1C1B2E]/50">
                      Technologies learned
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project?.technologies?.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full bg-[#A9C4F2]/50 px-3 py-1 text-xs font-medium text-[#1C1B2E]"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
          {/* Progress card */}
          <div className="rounded-[28px] bg-[#181818] p-6 text-white">
            <div className="text-sm font-medium text-[#FADF6B]/80">
              Projects completed
            </div>
            <div className="mt-1 flex items-end gap-1">
              <span className="font-display text-6xl font-bold text-[#FADF6B]">
                {done}
              </span>
              <span className="mb-2 text-xl font-semibold text-[#FADF6B]/50">
                /{total}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              {Array.from({ length: total }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    i < done ? "bg-[#FADF6B]" : "bg-white/15"
                  }`}
                />
              ))}
            </div>

            <p className="mt-4 text-sm text-white/60">
              {allDone
                ? "All done! Ready for the next level."
                : "Finish every project to unlock new ones."}
            </p>

            <button
              onClick={handelNewProjects}
              className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-bold transition-all ${
                allDone
                  ? "bg-[#FADF6B] text-[#1C1B2E] hover:scale-[1.02]"
                  : "cursor-not-allowed bg-white/10 text-white/40"
              }`}
            >
              New Projects →
            </button>
          </div>

          {/* Tips card */}
          <div className="rounded-[28px] bg-[#F7F4E3] p-6">
            <h3 className="font-display text-lg font-bold text-[#1C1B2E]">
              Tips for better results
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[#1C1B2E]">
              {[
                "Click a card to mark it complete",
                "Push each project to GitHub",
                "Write a README for every project",
              ].map((tip) => (
                <li key={tip} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#A3B676] text-xs text-white">
                    ✓
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Previous completed projects */}
      <div className="mx-auto mt-14 max-w-6xl">
        <h2 className="font-display text-2xl font-bold text-[#1C1B2E]">
          Previously completed
        </h2>

        {previousCompletedProjects.length === 0 ? (
          <div className="mt-4 rounded-[28px] border-2 border-dashed border-[#A3B676] bg-[#F7F4E3]/60 p-8 text-center text-sm text-[#1C1B2E]/60">
            Finish a batch and your completed projects will show up here.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {previousCompletedProjects.map((project, index) => (
              <div
                key={project?.title ?? index}
                className="rounded-[28px] bg-[#F7F4E3] p-5 ring-1 ring-black/5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#A3B676] px-3 py-1 text-xs font-bold text-white">
                    Completed
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1C1B2E] text-xs text-[#FADF6B]">
                    ✓
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-[#1C1B2E]">
                  {project?.title}
                </h3>
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#666477]">
                  {project?.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;