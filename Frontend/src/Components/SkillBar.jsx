const SkillBar = () => {
  const skills = [
    { name: "Database", value: 85, color: "bg-emerald-500" },
    { name: "Backend", value: 55, color: "bg-blue-500" },
    { name: "Cloud", value: 30, color: "bg-amber-500" },
  ];

  return (
    <div className="border-2 border-gray-600 rounded-3xl p-4 md:p-6">
      <h2 className="font-bold tracking-tight text-gray-700 mb-4">
        Skill Mix
      </h2>

      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center gap-3">
            {/* Fixed width label */}
            <div className="w-20 md:w-24 font-bold text-gray-800">
              {skill.name}
            </div>

            {/* Progress Bar */}
            <div className="flex-1 bg-gray-300 rounded-full h-4 overflow-hidden">
              <div
                className={`${skill.color} h-full`}
                style={{ width: `${skill.value}%` }}
              />
            </div>

            {/* Percentage */}
            <div className="w-12 text-right font-bold text-gray-500">
              {skill.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillBar;