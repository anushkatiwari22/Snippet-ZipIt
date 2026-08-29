const SkillBar = () => {
  const skills = [
    {
      name: "Database ",
      value: 85,
      color: "bg-emerald-500",
    },
    {
      name: "Backend",
      value: 55,
      color: "bg-blue-500",
    },
    {
      name: "Cloud",
      value: 30,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="border-2 border-gray-600 rounded-4xl h-50 flex flex-col gap-3 p-6 pl-20">
      <div className="font-bold tracking-tight text-gray-700">Skill Mix</div>

      {skills.map((skill)=> (
        <div className="flex items-center gap-7 " key={skill.name}>
            <div className="font-bold text-gray-800">{skill.name}</div>
            <div className="bg-gray-300 rounded-2xl h-4 w-3/4 overflow-hidden ">
            <div className={`${skill.color} h-full`} style={{width : `${skill.value}%`}}></div>
            </div>
            <div className="text-gray-500 font-bold">{skill.value}%</div>
        </div>
      ))}
    </div>
  );
};


export default SkillBar ; 