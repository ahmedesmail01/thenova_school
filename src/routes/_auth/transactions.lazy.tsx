import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useWalletTransactions } from "../../features/wallet/useWalletTransactions";
import { TransactionsTabHeader } from "../../features/wallet/components/TransactionsTabHeader";
import { TransactionsHistoryTable } from "../../features/wallet/components/TransactionsHistoryTable";
import { TransactionsPagination } from "../../features/wallet/components/TransactionsPagination";

export const Route = createLazyFileRoute("/_auth/transactions")({
  component: TransactionsRouteComponent,
});

function TransactionsRouteComponent() {
  const [activeTab, setActiveTab] = useState<"commission" | "token">(
    "commission",
  );
  const [page, setPage] = useState(1);

  const { data, isLoading } = useWalletTransactions(page);

  const currentTransactions =
    activeTab === "commission" ? data?.data?.data : data?.token?.data;
  const currentMeta =
    activeTab === "commission" ? data?.data?.meta : data?.token?.meta;

  const handleTabChange = (tab: "commission" | "token") => {
    setActiveTab(tab);
    setPage(1); // Reset to page 1 when switching tabs
  };

  return (
    <div className="min-h-[calc(100vh-100px)]  bg-[#f8fafc] w-full max-w-[1500px] mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[85vh] flex flex-col">
        {/* Tab Header */}
        <div className="pt-2 pl-4">
          <TransactionsTabHeader
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Data Table */}
        <div className="flex-1 mt-6">
          <TransactionsHistoryTable
            data={currentTransactions || []}
            isLoading={isLoading}
          />
        </div>

        {/* Pagination */}
        <TransactionsPagination meta={currentMeta} onPageChange={setPage} />
      </div>
    </div>
  );
}
