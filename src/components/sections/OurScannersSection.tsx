import React from "react";

const OurScannersSection = () => {
  return (
    <section className="relative w-full py-16 md:py-24 bg-white overflow-hidden font-sans">
      {/* --- Main Content --- */}
      <div className="relative z-10  mx-auto  flex flex-col items-center">
        {/* Header Text */}
        <div className="text-center max-w-7xl mb-16 p-4 md:mb-24">
          <h2 className="text-3xl md:text-[40px] font-bold text-[#1f2937] uppercase tracking-wide font-serif mb-6">
            Our Scanners
          </h2>
          <p className="max-w-xl mx-auto text-[#6b7280] text-base md:text-[18px] leading-relaxed">
            Unlock cutting - edge scanners and integrated trading
            <br className="hidden md:block" />
            tools that empower you to spot top trading
            <br className="hidden md:block" />
            opportunities as they happen....
          </p>
        </div>

        {/* Centered Image Container */}
        <div className="relative w-full   flex items-center  justify-center">
          {/* Main Mockup Image */}
          {/* Replace this src with the actual image of the devices */}
          <img
            src="/images/scanners-mockups.svg" // placeholder
            alt="Trading Scanners Devices"
            className="relative z-20 w-full  object-cover drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default OurScannersSection;
