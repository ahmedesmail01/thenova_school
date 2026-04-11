import { useState } from "react";
import { useUserTank } from "../../features/tank/useUserTank";
import { useUserData } from "../../features/auth/useUserData";
import { Loader2, AlertCircle } from "lucide-react";

// Extracted Components
import { TankHeader } from "../../features/tank/components/TankHeader";
import { TankMemberCard } from "../../features/tank/components/TankMemberCard";
import { TankPagination } from "../../features/tank/components/TankPagination";


export default function TankRouteComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: tankData,
    isLoading,
    isError,
    error,
  } = useUserTank(currentPage);
  const { data: userData } = useUserData();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (tankData?.tank.last_page || 1)) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="w-12 h-12 animate-spin text-brand-navy" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-medium">Error loading tank members</p>
        <p className="text-slate-500 text-sm">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
      </div>
    );
  }

  const tank = tankData?.tank;

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col">
      <TankHeader idCode={String(userData?.profile.id_code || "")} />

      {/* Main Content Area */}
      <div className="flex-1 bg-[#f8fafc] border border-slate-100 rounded-b-lg flex flex-col relative shadow-sm">
        <div className="flex-1  bg-[#f8fafc] rounded-2xl flex flex-col relative">
          {/* Members Grid Container */}
          <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-4">
            {tank?.data && tank.data.length > 0 ? (
              <div className="flex flex-col gap-8 items-center justify-center  w-full py-8">
                {tank.data.map((member) => (
                  <TankMemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 font-medium italic">
                No members in tank
              </div>
            )}
          </div>

          {tank && (
            <TankPagination
              currentPage={currentPage}
              lastPage={tank.last_page}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
