import { ChevronDown } from "lucide-react";

export function EarningsHero() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-50 flex flex-col md:flex-row overflow-hidden">
      {/* Left Dark Card */}
      <div className="md:w-[40%] bg-linear-to-br from-[#1b193f] to-[#0f0e24] p-8 flex flex-col relative overflow-hidden min-h-[300px]">
        {/* Background Network Pattern Placeholder */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-600/20 blur-3xl rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-600/30 blur-2xl rounded-full" />
          {/* Abstract lines to represent network */}
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="80%"
              y1="100%"
              x2="50%"
              y2="50%"
              stroke="rgba(236, 72, 153, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="50%"
              y1="50%"
              x2="100%"
              y2="40%"
              stroke="rgba(236, 72, 153, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="50%"
              y1="50%"
              x2="40%"
              y2="100%"
              stroke="rgba(236, 72, 153, 0.3)"
              strokeWidth="1"
            />
            <circle cx="50%" cy="50%" r="3" fill="#ec4899" />
            <circle cx="80%" cy="100%" r="2" fill="#ec4899" />
          </svg>
        </div>

        <div className="flex justify-between items-start relative z-10 w-full text-white">
          <h3 className="font-semibold text-base">Total Earnings</h3>
          <button className="flex items-center gap-1 text-xs border border-white/20 rounded-md px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors">
            Overall <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center relative z-10">
          <p className="text-white text-5xl font-semibold tracking-wider">
            $0.00
          </p>
        </div>
      </div>

      {/* Right List Items */}
      <div className="md:w-[60%] p-8 flex flex-col justify-center gap-6">
        {/* Item 1 */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-blue-500 rounded-full" />
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm">
                Personal Purchases
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Purchases and Upgrades.
              </p>
            </div>
          </div>
          <p className="text-blue-500 font-semibold text-sm">$0.00</p>
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm">
                Total Payout
              </p>
              <p className="text-slate-400 text-xs mt-0.5">Payout Processed</p>
            </div>
          </div>
          <p className="text-red-500 font-semibold text-sm">$0.00</p>
        </div>

        {/* Item 3 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm">
                Profit Gained
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Amount earned vs Amount spent
              </p>
            </div>
          </div>
          <p className="text-emerald-500 font-semibold text-sm">0%</p>
        </div>
      </div>
    </div>
  );
}
