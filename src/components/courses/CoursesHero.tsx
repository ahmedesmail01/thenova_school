import { useState } from "react";

const CoursesHero = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="relative pt-16 h-[357px] bg-hero-gradient flex flex-col items-center justify-center text-center border-b border-brand-border overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image – place hero-courses-bg.jpg in /public/images/ */}
        <img
          src="/images/hero-courses-bg.png"
          alt=""
          className="w-full h-full object-cover pointer-events-none opacity-60"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 px-4 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl sm:text-[64px] font-bold font-playfair text-white mb-6">
          Courses
        </h1>
        <p className="text-gray-100 mb-2 text-sm sm:text-xl font-medium">
          Discover the Best Courses to Develop Your Skills
        </p>

        <div className="w-full max-w-[600px] px-4 sm:px-0 mt-4">
          <div className="flex items-center bg-white rounded-full overflow-hidden pr-0 shadow-lg transition-all duration-300 h-[60px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full bg-transparent border-none focus:ring-0 px-8 text-[#1D2026] placeholder:text-[#999DA3] text-lg outline-none"
            />
            <button className="h-full shrink-0 transition-opacity hover:opacity-90">
              <img
                src="/icons/searchIcon.svg"
                alt="Search"
                className="h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesHero;
