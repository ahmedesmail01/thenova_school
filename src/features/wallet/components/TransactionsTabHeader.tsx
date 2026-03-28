interface TabHeaderProps {
  activeTab: "commission" | "token";
  onTabChange: (tab: "commission" | "token") => void;
}

export function TransactionsTabHeader({
  activeTab,
  onTabChange,
}: TabHeaderProps) {
  return (
    <div className="flex gap-8 mb-8 border-b border-slate-100">
      <button
        onClick={() => onTabChange("commission")}
        className={`pb-4 text-[15px] font-medium transition-all ${
          activeTab === "commission"
            ? "text-[#295175] border-b-[3px] border-[#295175]"
            : "text-slate-400 border-b-[3px] border-transparent hover:text-slate-600"
        }`}
      >
        Commission Transactions
      </button>
      <button
        onClick={() => onTabChange("token")}
        className={`pb-4 text-[15px] font-medium transition-all ${
          activeTab === "token"
            ? "text-[#295175] border-b-[3px] border-[#295175]"
            : "text-slate-400 border-b-[3px] border-transparent hover:text-slate-600"
        }`}
      >
        Token Transactions
      </button>
    </div>
  );
}
