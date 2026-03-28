const CoursesHero = () => {
  return (
    <div className="relative pt-16 h-[357px] bg-hero-gradient flex flex-col items-center justify-center text-center border-b border-brand-border">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image – place hero-courses-bg.jpg in /public/images/ */}
        <img
          src="/images/hero-courses-bg.png"
          alt=""
          className="w-full h-full object-cover  pointer-events-none"
          aria-hidden="true"
        />
      </div>
      <div className="relative z-10 px-4">
        <h1 className="text-3xl sm:text-[45px] font-bold font-playfair text-white">
          Courses
        </h1>
        <p className="text-gray-200 mt-2 text-sm  sm:text-[22px]">
          Discover the Best Courses to Develop Your Skills
        </p>
      </div>
    </div>
  );
};

export default CoursesHero;
