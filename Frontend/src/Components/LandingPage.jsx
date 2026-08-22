import React from 'react';
import bg from '../assets/careercoach-bgi.png';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#fbc2eb] via-[#f7ced7] to-[#fde191] font-sans text-slate-800 antialiased">
      
      {/* Sticky Full-Width Header */}
      <header className="sticky top-0 z-50 w-full bg-lightpink/80 backdrop-blur-md border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#2d2a3a] mb-6">
                    Sol<span className="text-[#e8a0c4]">vi</span>
                </h2>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8 text-sm font-bold text-slate-700">
            <a 
              href="#about" 
              onClick={(e) => scrollToSection(e, 'about')} 
              className="hover:text-[#f84a75] transition-colors cursor-pointer"
            >
              About Us
            </a>
            <a 
              href="#app" 
              onClick={(e) => scrollToSection(e, 'app')} 
              className="hover:text-[#f84a75] transition-colors cursor-pointer"
            >
              Our App
            </a>
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, 'contact')} 
              className="hover:text-[#f84a75] transition-colors cursor-pointer"
            >
              Contact Us
            </a>
          </nav>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 py-8">
        
        {/* HERO SECTION */}
        <section className="min-h-[80vh] flex items-center grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
          {/* Left Column: 3D Image Asset */}
          <div className="flex justify-center items-center -mt-16">
            <img
              src={bg}
              alt=""
              className="max-h-[80vh] w-auto object-contain scale-125"
            />
          </div>

          {/* Right Column: Copy & Actions */}
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Your Career Journey, <br />
              Guided by <span className="text-[#d97706]">AI</span>
            </h1>

            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium max-w-md">
             Discover what to learn next, improve your resume, track your progress, and move confidently toward your dream role.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-5 mt-2">
              <Link to="/signup"  className="bg-gradient-to-r from-[#ff517b] to-[#f83f6c] text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-lg hover:brightness-105 active:scale-95 transition-all">
                Sign up
              </Link>
              <Link to="/login" className="border-2 border-[#f84a75] text-[#f84a75] bg-white/80 backdrop-blur-sm hover:bg-[#f84a75] hover:text-white text-sm font-bold px-8 py-3 rounded-full shadow transition-all">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section id="about" className="pt-16 scroll-mt-24">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/60 shadow-xl">
            <h2 className="text-4xl font-black text-slate-900 mb-6">About Us</h2>
            <p className="text-base text-slate-700 leading-relaxed max-w-3xl mb-8 font-medium">
             Your Future Deserves More Than Generic Advice<br></br>
               Most career guidance is one-size-fits-all. We built an AI-powered platform that understands your goals, analyzes your progress, and helps you make smarter career decisions. From learning new skills to landing your dream job, we're your personalized career companion.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-pink-50/80 p-6 rounded-2xl border border-pink-100 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Discover Your Path</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Get career recommendations based on your interests and strengths.</p>
              </div>
              <div className="bg-pink-50/80 p-6 rounded-2xl border border-pink-100 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Accelerate Your Growth</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Follow personalized roadmaps and stay consistent with daily goals.</p>
              </div>
              <div className="bg-pink-50/80 p-6 rounded-2xl border border-pink-100 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Learn With Confidence</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Receive AI-powered insights on resumes, projects, and interview preparation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* OUR APP SECTION */}
        <section id="app" className="pt-16 scroll-mt-24">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-900 mb-6">Our Platform</h2>
              <p className="text-base text-slate-700 leading-relaxed mb-8 font-medium">
                From choosing the right skills to preparing for interviews, our AI mentor provides personalized guidance at every stage of your career journey.
              </p>
            </div>
            <div className="w-full md:w-auto flex justify-center">
              <div className="w-56 h-56 bg-pink-100/70 rounded-3xl border border-pink-200 flex items-center justify-center text-slate-800 font-bold text-lg shadow-inner">
                App Preview
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT US SECTION */}
        <section id="contact" className="pt-16 pb-24 scroll-mt-24">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/60 shadow-xl max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 mb-4 text-center">Contact Us</h2>
            <p className="text-sm text-slate-600 mb-8 text-center font-medium">
              Have questions or want to build something amazing together? Reach out to us.
            </p>

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#f84a75] focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#f84a75] focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea 
                  placeholder="Tell us about your project..." 
                  rows={4} 
                  className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#f84a75] focus:border-transparent transition-all resize-none shadow-sm"
                />
              </div>
              <button className="bg-gradient-to-r from-[#ff517b] to-[#f83f6c] text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all mt-2 w-full">
                Send Message
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900/10 py-6 text-center text-xs font-semibold text-slate-700">
        © {new Date().getFullYear()} D CREATIVE. All rights reserved.
      </footer>
    </div>
  );
}