import { useState, useMemo } from "react";
import { useCommissionSummary } from "../../features/wallet/useCommissionSummary";
import { CommissionHistoryTable } from "../../features/wallet/components/CommissionHistoryTable";
import { CommissionFilters } from "../../features/wallet/components/CommissionFilters";


export default function CommissionsRouteComponent() {
  const { data, isLoading } = useCommissionSummary();
  const [selectedDate, setSelectedDate] = useState("");

  const filteredCommissions = useMemo(() => {
    if (!data?.commissions) return [];
    if (!selectedDate) return data.commissions;

    return data.commissions.filter((c) => {
      const commissionDate = new Date(c.created_at).toISOString().split("T")[0];
      return commissionDate === selectedDate;
    });
  }, [data, selectedDate]);

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#f8fafc] w-full max-w-[1500px] mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[85vh] flex flex-col">
        {/* Header Actions */}
        <CommissionFilters
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onReset={() => setSelectedDate("")}
        />

        {/* Data Table */}
        <div className="flex-1 mt-2">
          <CommissionHistoryTable
            data={filteredCommissions}
            isLoading={isLoading}
          />
        </div>

        {/* Pagination logic can be added here if the API starts returning paginated data, 
            for now the summary is a flat list according to the user's provided logic. */}
      </div>
    </div>
  );
}
