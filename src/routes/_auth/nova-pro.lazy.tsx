import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/nova-pro")({
  component: NovaProRouteComponent,
});

// Mock data based on the screenshot provided
const novaTransactions = Array(8).fill({
  amount: "$75.00",
  percentage: "%99",
  date: "23/11/2025, 8:22:57 PM",
});

function ActionBar() {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 mx-auto pl-4">
      {/* Read-only Stats */}
      <div className="bg-[#e2e8f0] text-slate-600 text-[13px] font-bold px-6 py-2.5 rounded-sm">
        Available Amount: 0
      </div>
      <div className="bg-[#e2e8f0] text-slate-600 text-[13px] font-bold px-6 py-2.5 rounded-sm">
        Total Amount: 0
      </div>

      {/* Input Field */}
      <div className="flex-1 min-w-[200px] max-w-sm ml-2">
        <input
          type="text"
          placeholder="Enter Amount..."
          className="w-full border border-slate-300 rounded-sm px-4 py-2.5 text-[13px] text-slate-600 placeholder:text-slate-400 focus:outline-none focus:border-[#295175] focus:ring-1 focus:ring-[#295175]"
        />
      </div>

      {/* Action Button */}
      <button className="bg-[#1f3a53] hover:bg-[#15283b] text-white text-[13px] font-medium px-8 py-2.5 rounded-sm transition-colors">
        Transfer
      </button>
    </div>
  );
}

function NovaProTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm">
              Amount
            </th>
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm text-center">
              Percentage
            </th>
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm text-right">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {novaTransactions.map((tx, idx) => (
            <tr
              key={idx}
              className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
            >
              <td className="py-6 px-6 text-slate-800 font-medium text-[15px]">
                {tx.amount}
              </td>
              <td className="py-6 px-6 text-slate-700 font-medium text-[15px] text-center">
                {tx.percentage}
              </td>
              <td className="py-6 px-6 text-slate-700 font-medium text-[15px] text-right">
                {tx.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NovaProPagination() {
  return (
    <div className="flex items-center justify-center gap-2 mt-auto pt-8 pb-4">
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-bold text-xs">
        &lt;
      </button>
      <button className="w-8 h-8 rounded-full bg-[#295175] flex items-center justify-center text-white shadow-md font-semibold text-xs">
        1
      </button>
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-semibold text-xs">
        2
      </button>
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-semibold text-xs">
        3
      </button>
      <div className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold tracking-widest leading-none pb-2 text-xs">
        ...
      </div>
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-semibold text-xs">
        10
      </button>
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-bold text-xs">
        &gt;
      </button>
    </div>
  );
}

function NovaProRouteComponent() {
  return (
    <div className="min-h-[calc(100vh-100px)]  bg-[#f8fafc] w-full max-w-[1500px] mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[85vh] flex flex-col">
        {/* Action Bar */}
        <ActionBar />

        {/* Data Table */}
        <div className="flex-1 mt-2">
          <NovaProTable />
        </div>

        {/* Pagination */}
        <NovaProPagination />
      </div>
    </div>
  );
}
