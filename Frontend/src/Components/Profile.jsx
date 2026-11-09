import { useContext, useEffect } from "react";
import UserContext from "../utils/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import { handleError } from "../utils/popups";

// UI ONLY: small line icon wrapper (same style as the Dashboard icons)
const Icon = ({ children }) => (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

const Profile = () => {
    const { obj, setObj } = useContext(UserContext);
    const [ username, setUsername ] = useState(null);
    const [ email, setEmail ] = useState(null);
    const [ pfpUrl, setPfpUrl ] = useState(null)
    const imageRef = useRef();
    // UI ONLY: which tab is open ("overview" or "edit")
    const [ tab, setTab ] = useState("overview");

    useEffect(() => {
        if(obj?.userid != undefined) {
            getInfo();
        }
    },[obj?.userid])

    async function getInfo() {
         try {
            const response = await axios.post("http://localhost:3000/userinfo",{
                userid : obj?.userid
            });

            console.log(response);

            setUsername(response?.data?.username ?? "");
            setEmail(response?.data?.email ?? "");
            setPfpUrl(response?.data?.pfp ?? "");
        } catch (error) {
            console.error("getInfo error:", error);
            handleError("Could not load your profile");
        }
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];

        if(!file) return;

        if(file.size > 2 * 1024 * 1024) {
            handleError("please select the image of size upto 2MB");
            e.target.value = "";
            return;
        }
        console.log(file);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
            setPfpUrl(fileReader.result);
            
        }
    }

    async function updatedb() {
        try {
            const response = await axios.post("http://localhost:3000/updateinfo", {
                userid : obj?.userid,
                username : username,
                pfpUrl : pfpUrl
            })
 
            console.log(response);
        } catch (error) {
            console.error("updatedb error:", error);
            handleError("Could not save your profile");
        }
    }

    // UI ONLY: how many of the 3 profile items are filled
    const filled = [username, email, pfpUrl].filter(Boolean).length;
    const hint = !pfpUrl
        ? "Add a photo to complete your profile."
        : !username
        ? "Add a username to complete your profile."
        : "Your profile is complete. Nice work!";

    if(obj?.userid == undefined) return null;
    return (
        <>
            {/* Signature yellow background */}
            <div className="min-h-screen w-full bg-[#FADF63] px-4 py-8 md:px-10">
                {/* One big profile card */}
                <div className="mx-auto max-w-4xl overflow-hidden rounded-[36px] bg-[#F6F3E4] shadow-lg">
                    {/* Cover */}
                    <div className="relative h-44 overflow-hidden bg-[#F6A9CB]">
                        <div className="absolute -bottom-8 right-52 hidden h-28 w-28 rounded-full bg-[#A9C5F2] md:block" />
                        <div className="absolute -top-10 right-20 hidden h-36 w-36 rounded-[42%] bg-[#FADF63] md:block" />
                        <div className="absolute right-48 top-6 hidden h-4 w-4 rounded-full bg-[#19181A] md:block" />
                        <div className="absolute right-28 top-10 hidden h-16 w-16 items-center justify-center rounded-full bg-[#19181A] md:flex">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#FADF63]">
                                <div className="h-2 w-2 rounded-full bg-[#FADF63]" />
                            </div>
                        </div>
                        <div className="absolute -bottom-4 right-8 hidden h-16 w-16 rotate-12 rounded-2xl bg-[#A3B676] md:block" />
                    </div>

                    {/* Avatar, name and save button */}
                    <div className="flex flex-col gap-4 px-6 md:flex-row md:items-end md:px-10">
                        <div className="relative -mt-16 shrink-0">
                            {pfpUrl ? (
                                <img
                                    src={pfpUrl}
                                    alt="pfp"
                                    className="h-32 w-32 cursor-pointer rounded-full object-cover ring-[6px] ring-[#F6F3E4]"
                                    onClick={() => {
                                        imageRef.current.click();
                                    }}
                                />
                            ) : (
                                <div
                                    className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full bg-[#19181A] font-display text-5xl font-bold text-[#FADF63] ring-[6px] ring-[#F6F3E4]"
                                    onClick={() => {
                                        imageRef.current.click();
                                    }}
                                >
                                    {username?.[0]?.toUpperCase() ?? "?"}
                                </div>
                            )}
                            <div
                                className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#19181A] text-[#FADF63] ring-4 ring-[#F6F3E4]"
                                onClick={() => {
                                    imageRef.current.click();
                                }}
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                                </svg>
                            </div>
                            <input type="file" accept="image/png, image/jpg, image/jpeg" className="hidden" ref={imageRef} onChange={handleImageUpload}/>
                        </div>

                        <div className="min-w-0 flex-1 md:pb-3">
                            <div className="truncate font-display text-3xl font-bold text-[#19181A]">
                                {username || "Your name"}
                            </div>
                            <div className="truncate text-[#666477]">{email}</div>
                        </div>

                        <button className="rounded-full bg-[#19181A] px-7 py-3 font-semibold text-[#FADF63] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:mb-3" onClick={updatedb}>
                            Save changes
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="mt-8 px-6 md:px-10">
                        <div className="inline-flex rounded-full bg-[#ECE9DB] p-1">
                            <button
                                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200 ${
                                    tab === "overview" ? "bg-[#19181A] text-[#FADF63]" : "text-[#666477] hover:text-[#19181A]"
                                }`}
                                onClick={() => setTab("overview")}
                            >
                                Overview
                            </button>
                            <button
                                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200 ${
                                    tab === "edit" ? "bg-[#19181A] text-[#FADF63]" : "text-[#666477] hover:text-[#19181A]"
                                }`}
                                onClick={() => setTab("edit")}
                            >
                                Edit profile
                            </button>
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="px-6 pb-10 pt-6 md:px-10">
                        {tab === "overview" ? (
                            <>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="flex items-center gap-4 rounded-3xl bg-[#19181A] p-5">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FADF63]/15 text-[#FADF63]">
                                            <Icon>
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M4 21a8 8 0 0 1 16 0" />
                                            </Icon>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate font-display text-lg font-semibold text-[#FADF63]">{username || "Not set"}</div>
                                            <div className="text-sm text-[#FADF63]/60">Username</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-3xl bg-[#F6A9CB] p-5">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/40 text-[#19181A]">
                                            <Icon>
                                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                                <path d="m3 7 9 6 9-6" />
                                            </Icon>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate font-display text-lg font-semibold text-[#19181A]">{email || "Not set"}</div>
                                            <div className="text-sm text-[#19181A]/60">Email</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-3xl bg-[#A9C5F2] p-5">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/50 text-[#19181A]">
                                            <Icon>
                                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                                <circle cx="9" cy="9" r="2" />
                                                <path d="m21 15-5-5L5 21" />
                                            </Icon>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate font-display text-lg font-semibold text-[#19181A]">{pfpUrl ? "Added" : "Not added"}</div>
                                            <div className="text-sm text-[#19181A]/60">Profile photo</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Strength strip, same look as the "vibe check" strip */}
                                <div className="mt-5 flex flex-col gap-4 rounded-3xl bg-[#ECE9DB] p-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FADF63] text-[#19181A]">
                                            <Icon>
                                                <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" />
                                            </Icon>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-[#666477]">Profile strength · {filled}/3</div>
                                            <div className="font-display text-lg font-semibold text-[#1C1B2E]">{hint}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 sm:w-48">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${
                                                    i < filled ? "bg-[#19181A]" : "bg-[#19181A]/15"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="rounded-3xl bg-[#ECE9DB] p-6">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-[#666477]">Username</label>
                                        <input type="text" name="username" id="username" className="rounded-2xl border-2 border-transparent bg-[#F6F3E4] px-4 py-3 text-[#1C1B2E] outline-none transition-colors placeholder:text-[#666477]/60 focus:border-[#19181A]" placeholder="username" value={username ?? ""} onChange={(e) => {
                                            setUsername(e.target.value);
                                        }}/>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[#666477]">Email</label>
                                        <input type="text" name="email" id="email" className="cursor-not-allowed rounded-2xl border-2 border-transparent bg-[#F6F3E4]/60 px-4 py-3 text-[#666477] outline-none" placeholder="email" value={email ?? ""} readOnly/>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link className="inline-block rounded-full border-2 border-[#19181A] px-6 py-2.5 font-semibold text-[#19181A] transition-all duration-200 hover:bg-[#19181A] hover:text-[#FADF63]" to="/dashboard/changepassword">Change password</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}

export default Profile;