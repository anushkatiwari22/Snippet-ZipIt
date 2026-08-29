const NextSteps = ()=>{

    const tasks = [
        {
            name : "Run the Resume Analyzer"
        } ,
        {
            name : "Complete week 1"
        } ,
        {
            name : "Review 3 new job matches"
        }
    ]

    return (
        <div className="h-50 flex flex-col pt-6 pl-20 gap-4 border-2 border-gray-600 rounded-4xl">
            <div className="tracking-tight font-bold text-gray-600">Next Steps</div>
            {tasks.map((task)=>(
                <div key={task.name} className="flex gap-4">
                    <input className="h-5 w-5" type="checkbox" />
                    <label htmlFor={task.name} className="tracking-tight font-medium">{task.name}</label>
                </div>
            ))}

        </div>
    )
}

export default NextSteps ;