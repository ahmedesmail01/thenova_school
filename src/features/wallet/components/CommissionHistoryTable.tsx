import { type Commission } from "../useCommissionSummary";
import { formatPrice } from "../../../lib/utils";

interface CommissionHistoryTableProps {
  data: Commission[];
  isLoading: boolean;
}

export function CommissionHistoryTable({
  data,
  isLoading,
}: CommissionHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="text-slate-400 font-medium animate-pulse">
          Loading commissions...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="text-slate-400 font-medium text-center">
          <p>No commissions found.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm">
              Amount
            </th>
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm">
              Type
            </th>
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm text-center">
              Date
            </th>
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm text-center">
              Referral Name
            </th>
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm text-center">
              Referral Code
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, idx) => (
            <tr
              key={c.id}
              className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                idx % 2 === 0 ? "bg-slate-50/30" : "bg-white"
              }`}
            >
              <td className="py-6 px-6 text-slate-800 font-medium text-[15px]">
                {formatPrice(Number(c.commission_value))}
              </td>
              <td className="py-6 px-6 text-slate-700 font-medium text-[15px]">
                {c.commission_type}
              </td>
              <td className="py-6 px-6 text-slate-700 font-medium text-[15px] text-center">
                {formatDate(c.created_at)}
              </td>
              <td className="py-6 px-6 text-slate-800 font-medium text-[15px] text-center">
                {c.referral_username || "N/A"}
              </td>
              <td className="py-6 px-6 text-slate-700 font-medium text-[15px] text-center">
                {c.referral_id_code || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
