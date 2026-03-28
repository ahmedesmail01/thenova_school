import { createLazyFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { TeamSalesCard } from "../../components/dashboard/TeamSalesCard";
import { RankGoalsCard } from "../../components/dashboard/RankGoalsCard";
import { UserProfileCard } from "../../components/dashboard/UserProfileCard";
import SummaryRow from "../../components/dashboard/SummaryRow";
import Card from "../../components/dashboard/Card";
import { MemberJoiningsCard } from "../../components/dashboard/MemberJoiningsCard";
import BottomStatsRow from "../../components/dashboard/BottomStatsRow";
import Activites from "../../components/dashboard/Activites";

import TeamPerformanceCard from "../../components/dashboard/TeamPerformanceCard";
import { useDashboardData } from "../../hooks/dashboard/useDashboardData";

export const Route = createLazyFileRoute("/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] animate-pulse">
        <img
          src="/images/nova-logo.png"
          alt="Loading..."
          className="w-24 h-24 object-contain animate-bounce"
        />
      </div>
    );
  }

  console.log("Dashboard Data:", data);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* SECTION 1: Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Team Sales Component */}
        <TeamSalesCard data={data?.data} className="lg:col-span-1" />

        {/* Next Rank Goals Component */}
        <RankGoalsCard data={data?.data} className="lg:col-span-1" />

        {/* User Profile Card Component */}
        <UserProfileCard data={data?.data} className="lg:col-span-1" />
      </div>

      {/* SECTION 2: Summary Row */}
      <SummaryRow data={data?.data} />

      {/* SECTION 3: Map & News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Joinings Component */}
        <MemberJoiningsCard />

        {/* Activites Component */}
        <Activites />
      </div>

      {/* SECTION 4: Bottom Stats Row Component */}
      <BottomStatsRow data={data?.data} />

      {/* SECTION 5: Performance & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Team Performance Component */}
        <TeamPerformanceCard />

        {/* Corporate Events */}
        <Card
          className="lg:col-span-3"
          title="Corporate Events"
          extra={
            <button className="text-[14px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider hover:bg-blue-100">
              Show All
            </button>
          }
        >
          <div className="w-full">
            <div className="flex justify-center items-center gap-8 mb-8">
              <button className="text-slate-400 hover:text-blue-600 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="text-lg font-black text-[#1a2d42]">
                Feb - 2026
              </div>
              <button className="text-slate-400 hover:text-blue-600 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div
                  key={day}
                  className="bg-slate-50/50 py-3 text-center text-[10px] font-black text-slate-400 tracking-widest"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-white aspect-square flex items-center justify-center text-sm font-bold transition-all hover:bg-blue-50 cursor-pointer border-[0.5px] border-slate-50",
                    i + 1 === 5
                      ? "text-blue-600 bg-blue-50/50 ring-1 ring-inset ring-blue-100"
                      : "text-slate-600",
                  )}
                >
                  {i + 1}
                </div>
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-slate-50/20 aspect-square flex items-center justify-center text-xs font-bold text-slate-200"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
