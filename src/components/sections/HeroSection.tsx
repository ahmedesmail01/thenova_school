const heroBg = "/images/hero-bg.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center  text-center overflow-hidden">
      {/* Background image – place hero-bg.jpg in /public/images/ */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="relative z-10 text-center flex flex-col items-center justify-center px-4 max-w-5xl mx-auto ">
        <div className="text-2xl lg:text-[55px] font-semibold flex items-center lg:gap-2 font-playfair">
          The <div className="novagroup">Nova Group</div> CO.
        </div>
        <div className="text-2xl lg:text-[55px]  font-bold font-playfair">
          Your next evolution starts here.
        </div>
      </div>
    </section>
  );
}
