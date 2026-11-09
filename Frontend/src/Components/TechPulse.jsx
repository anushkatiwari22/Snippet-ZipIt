import { useEffect } from "react";
import { useState } from "react";
import Shimmer from "./Shimmer";
import NewsCard from "./NewsCard";

const TECHPULSE_API = import.meta.env.VITE_TECHPULSE_API;
const TechPulse = () => {

    const [ newsArray, setNewsArray ] = useState([]);

    useEffect(() => {
        getTechNews();
        const refreshNews = setInterval(getTechNews,10 * 60 * 1000);
        return () => {
            clearInterval(refreshNews);
        }
    },[])

    async function getTechNews() {
            const response = await fetch(TECHPULSE_API);
            const data = await response.json(response);
            
            console.log(data?.response?.results);
            setNewsArray(data?.response?.results);
        }
    
    if(newsArray == null) return;
    return (
        <div className="min-h-screen bg-[#FADF6B] px-6 pb-16 pt-8">
            <div className="text-center">
                <h1 className="font-display text-5xl font-bold tracking-tight text-[#1C1B2E]">
                    TechPulse
                </h1>
                <p className="mt-3 text-base text-[#1C1B2E]/70">
                    The latest in tech, so you always know what's next.
                </p>
                <span className="mt-4 inline-block rounded-full bg-[#181818] px-4 py-1.5 text-sm font-bold text-[#FADF6B]">
                    {newsArray.length} fresh stories
                </span>
            </div>

            {
                newsArray.length === 0 ? <Shimmer /> : 
                (
                    <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {
                            newsArray.map((news, i) => {
                                return (
                                    <NewsCard key={news.id} index={i} {...news}/>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

export default TechPulse;