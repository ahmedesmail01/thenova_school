import React from "react";

const TradeAlertSection = () => {
  return (
    <section className="relative w-full py-12 bg-white md:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* The Card */}
        <div className="relative w-full rounded-2xl md:rounded-4xl overflow-hidden shadow-2xl bg-linear-to-b from-[#142B41] via-[#1C4164] to-[#428EE1]">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16">
            {/* Left Content Area */}
            <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col items-start text-left z-10 mb-8 md:mb-0">
              <span className="text-[#60a5fa] uppercase tracking-wider font-semibold text-sm md:text-base mb-4 drop-shadow-sm">
                TRADE ALERT
              </span>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight md:leading-snug mb-6">
                Stay Ahead of the Market with Daily Trade Ideas from Trading
                Society Traders !
              </h2>

              <p className="text-white font-medium text-sm md:text-base leading-relaxed max-w-lg">
                Unlock profitable opportunities by following our our traders
                trade alerts, delivered daily for forex. Indices, and
                Commodities.
              </p>
            </div>

            {/* Right Image Area */}
            <div className="w-full md:w-2/5 lg:w-1/2 flex items-center justify-center relative z-10">
              <img
                src="/images/trade-alert-mokup.svg"
                alt="Trade Alert Graphic"
                className="w-full h-auto max-w-[320px] lg:max-w-[450px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeAlertSection;
