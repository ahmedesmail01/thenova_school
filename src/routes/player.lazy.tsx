import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { VideoPlayer } from "../features/courses/components/VideoPlayer";
import { PlayerSidebar } from "../features/courses/components/PlayerSidebar";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Info, Globe, FileText } from "lucide-react";

export const Route = createLazyFileRoute("/player")({
  component: PlayerPage,
});

function PlayerPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1D2026] font-poppins flex flex-col">
      <Navbar />

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col lg:flex-row pt-16">
        {/* Left Focus Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-12 lg:px-20 pb-20 space-y-10 scrollbar-hide bg-white">
          {/* Top Navigation & Title */}
          <div className="space-y-6 pt-12">
            <Link
              to="/profile"
              className="text-[#4E5566] font-semibold text-[13px] hover:text-[#458FCE] flex items-center gap-2 w-fit transition-all hover:-translate-x-1"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-[32px] font-bold text-[#1D2026] leading-tight max-w-3xl">
              Lecture 1: Introduction to Quality Management Systems
            </h1>
          </div>

          {/* Immersive Video Section */}
          <div className="space-y-6">
            <VideoPlayer />

            {/* Metadata layer */}
            <div className="flex items-center gap-12 py-1">
              <div className="flex items-center gap-2.5 text-[#4E5566] text-[15px] font-medium">
                <Info size={16} className="text-slate-400" />
                <span>Last updated January 2025</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#4E5566] text-[15px] font-medium">
                <Globe size={16} className="text-slate-400" />
                <span>Arabic</span>
              </div>
            </div>
          </div>

          {/* Detailed Course Information */}
          <div className="space-y-12 pr-0 lg:pr-12">
            {/* Overview */}
            <section className="space-y-4">
              <h2 className="text-[22px] font-bold text-[#1D2026]">Overview</h2>
              <p className="text-[#4E5566] text-lg leading-relaxed max-w-4xl font-medium">
                This lesson provides an overview of ISO 9001:2015 and explains
                the importance of quality management in organizations. You will
                learn the key principles and structure of the standard.
              </p>
            </section>

            {/* By the Numbers */}
            <section className="space-y-6">
              <h2 className="text-[22px] font-bold text-[#1D2026]">
                By the Numbers
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 max-w-2xl">
                <li className="flex items-start gap-4 text-[#4E5566] text-[17px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-[10px] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1D2026]">
                      Skill Level:
                    </span>{" "}
                    Beginner
                  </div>
                </li>
                <li className="flex items-start gap-4 text-[#4E5566] text-[17px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-[10px] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1D2026]">
                      Students Enrolled:
                    </span>{" "}
                    3,266
                  </div>
                </li>
                <li className="flex items-start gap-4 text-[#4E5566] text-[17px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-[10px] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1D2026]">
                      Course Language:
                    </span>{" "}
                    Arabic
                  </div>
                </li>
                <li className="flex items-start gap-4 text-[#4E5566] text-[17px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-[10px] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1D2026]">Captions:</span>{" "}
                    Available
                  </div>
                </li>
                <li className="flex items-start gap-4 text-[#4E5566] text-[17px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-[10px] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1D2026]">Lectures:</span>{" "}
                    27
                  </div>
                </li>
                <li className="flex items-start gap-4 text-[#4E5566] text-[17px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-[10px] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1D2026]">
                      Total Video Duration:
                    </span>{" "}
                    2.5 hours
                  </div>
                </li>
              </ul>
            </section>

            {/* Certificates */}
            <section className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-[22px] font-bold text-[#1D2026]">
                  Certificates
                </h2>
                <p className="text-[#4E5566] text-lg font-medium">
                  Get a NOVA certificate upon successful completion of the
                  course
                </p>
              </div>
              <div className="w-fit p-4 px-8 rounded-lg bg-[#EAF2F9] flex items-center gap-4 group cursor-pointer hover:bg-[#DCE9F5] transition-all">
                <div className="text-[#458FCE]">
                  <FileText size={22} strokeWidth={2.5} />
                </div>
                <span className="text-[#458FCE] font-bold text-[15px]">
                  Certificates
                </span>
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar Playlist Section */}
        <div className="w-full lg:w-[450px] xl:w-[500px] h-full lg:h-screen lg:sticky lg:top-0 shrink-0">
          <PlayerSidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
