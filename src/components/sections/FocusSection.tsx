const unsplashVideo = "/images/unsplash-videopng.png";

const FOCUS_ITEMS = [
  {
    label: "OUR VISION",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M22 12c0-1.2-4.03-7-10-7S2 10.8 2 12s4.03 7 10 7 10-5.8 10-7z" />
      </svg>
    ),
    text: "NOVA Group empowers growth and transformation worldwide through innovation, education, and smart investments — shaping a future driven by progress, prosperity, and purpose.",
    variant: "primary",
  },
  {
    label: "OUR MISSION",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.5-1 1-4c2 0 3 .5 3 .5l1 3.5z" />
        <path d="M12 15v5s1-.5 4-1c0-2-.5-3-.5-3L12 15z" />
      </svg>
    ),
    text: "NOVA Group empowers individuals and communities through innovative pathways in financial growth, education, and well-being — creating an ecosystem that inspires progress and lasting success.",
    variant: "secondary",
  },
  {
    label: "OUR OBJECTIVES",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m3 17 2 2 4-4 4 4 8-8" />
        <path d="M17 7h4v4" />
      </svg>
    ),
    text: "NOVA Group empowers growth and transformation worldwide through innovation, education, and smart investments — shaping a future driven by progress, prosperity, and purpose.",
    variant: "secondary",
  },
  {
    label: "OUR GOALS",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" x2="4" y1="22" y2="15" />
      </svg>
    ),
    text: "NOVA Group empowers growth and transformation worldwide through innovation, education, and smart investments — shaping a future driven by progress, prosperity, and purpose.",
    variant: "secondary",
  },
];

const WavyLine = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="145"
    height="18"
    viewBox="0 0 145 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M38.6474 10.6001C32.4179 12.2268 25.2255 13.8456 18.3064 14.2498C12.3926 14.5948 6.68034 14.0589 2.00479 11.779C1.3457 11.458 0.520348 11.6787 0.163908 12.2728C-0.193075 12.8664 0.0525179 13.6097 0.711605 13.9312C5.81206 16.4177 12.0313 17.068 18.4819 16.6912C25.5254 16.2802 32.8477 14.6506 39.2022 13.0004C39.9395 14.3457 41.4664 15.5999 44.156 16.5253C48.2871 17.9469 53.9276 17.9293 59.8697 17.1282C68.4878 15.9669 77.7585 13.1977 83.7191 11.2299C83.9636 11.1497 84.3277 11.022 84.7732 10.8536C84.9091 11.1238 85.0612 11.39 85.2296 11.6513C86.6913 13.9288 89.2776 15.7702 91.9129 16.4279C108.626 20.5983 128.133 15.6014 144.015 11.5348C144.732 11.3503 145.151 10.6731 144.95 10.0237C144.743 9.3743 143.993 8.997 143.271 9.18149C127.834 13.1345 108.882 18.1221 92.6355 14.0697C90.636 13.5705 88.6908 12.1553 87.5824 10.4269C87.4574 10.2341 87.3487 10.0369 87.2455 9.83674C89.4352 8.85949 92.0107 7.49712 93.3963 6.03882C94.8198 4.54383 95.173 2.94803 93.9342 1.4408C92.8692 0.152313 91.2554 0.0426937 89.5765 0.71067C87.7671 1.42611 85.9034 3.09872 85.3003 3.88366C84.1701 5.34978 83.8115 6.94022 84.018 8.491C83.4855 8.69359 83.053 8.84431 82.7862 8.93239C76.956 10.8566 67.8945 13.5725 59.4676 14.7083C54.0455 15.4394 48.8951 15.5368 45.1253 14.24C43.5175 13.6865 42.4552 13.0406 41.8787 12.2909C43.0165 11.9845 44.1136 11.6831 45.1617 11.3954C47.2346 10.8262 51.5504 9.88422 54.634 8.20522C57.0861 6.87025 58.7488 5.05423 58.6521 2.77773C58.6026 1.60816 57.8512 0.827613 56.6552 0.390125C54.8681 -0.263171 51.7776 0.0529492 50.6267 0.273161C47.1362 0.93967 42.4775 3.6987 40.1726 6.8076C39.2527 8.04813 38.7056 9.34591 38.6474 10.6001ZM41.5147 9.83575C42.5009 9.56856 43.4539 9.30626 44.3695 9.05473C46.3044 8.52329 50.3491 7.67913 53.2283 6.11122C54.753 5.28127 55.9978 4.2869 55.9375 2.87118C55.9326 2.76108 55.8114 2.72977 55.7044 2.68475C55.5386 2.61575 55.349 2.56827 55.1469 2.53108C53.7793 2.27954 51.9422 2.52275 51.1902 2.66662C48.2615 3.22596 44.3657 5.55776 42.4319 8.16654C42.0233 8.71756 41.6978 9.27886 41.5147 9.83575ZM86.7021 7.36449C87.979 6.77286 89.3157 6.0574 90.3698 5.27883C90.9294 4.86532 91.4022 4.44008 91.701 3.99868C91.9509 3.63362 92.0487 3.25972 91.7499 2.89857C91.6303 2.75225 91.4511 2.74934 91.2663 2.77674C91.0707 2.8061 90.8697 2.86872 90.6686 2.94947C89.3428 3.47504 87.9736 4.70285 87.5335 5.27883C87.0173 5.9468 86.7619 6.65345 86.7021 7.36449Z"
      fill="currentColor"
    />
  </svg>
);

export function FocusSection() {
  return (
    <section className="py-32 px-4 lg:px-[120px] bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,475px)_1fr] gap-16 items-start">
        {/* Left: Heading + Video */}
        <div className="space-y-12">
          <div className="space-y-0 inline-block">
            <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-brand-blue-light to-brand-navy bg-clip-text text-transparent font-playfair leading-tight">
              OUR <br />
              FOCUS
            </h2>
            <WavyLine className="text-brand-blue mt-2 w-24 h-auto" />
          </div>

          <div className="relative group ">
            {/* Blue Decorative Shape */}
            <div className="absolute -bottom-2 -right-4  md:-bottom-6 md:-right-6 w-30 h-30 md:w-48 md:h-48 rounded-2xl z-20 pointer-events-none">
              <img
                src="/images/triangleVector.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
            <div className="relative z-10 w-full max-h-[570px] aspect-575/670 rounded-[33px] overflow-hidden">
              <img
                src={unsplashVideo}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* <div className="absolute inset-0 bg-black/10" /> */}
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center text-xl shadow-2xl border border-white/40 transform transition-transform group-hover:scale-110">
                <span className="ml-1">▶</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Cards */}
        <div className="flex flex-col gap-6 pt-12 lg:pt-0 min-w-0 font-inter">
          {FOCUS_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`group max-w-[900px]  rounded-[30px] p-8 flex flex-col md:flex-row gap-6 transition-all duration-500 cursor-default ${
                item.variant === "primary"
                  ? "bg-linear-to-r from-brand-blue-light to-brand-navy text-white shadow-xl"
                  : "bg-[#F3F4F6] text-[#1a365d] hover:bg-linear-to-r hover:from-brand-blue-light hover:to-brand-navy hover:text-white hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              <div
                className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                  item.variant === "primary"
                    ? "border-white/20"
                    : "border-[#1a365d]/10 group-hover:border-white/20"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-sm font-montserrat font-bold tracking-wider uppercase opacity-90 transition-opacity duration-500">
                    {item.label}
                  </h3>
                  <WavyLine
                    className={`mt-1 w-16 h-auto transition-colors duration-500 ${
                      item.variant === "primary"
                        ? "text-white/40"
                        : "text-brand-blue group-hover:text-white/40"
                    }`}
                  />
                </div>
                <p
                  className={`text-sm leading-relaxed transition-colors duration-500 ${
                    item.variant === "primary"
                      ? "text-blue-50/90"
                      : "text-[#4a5568] group-hover:text-blue-50/90"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
