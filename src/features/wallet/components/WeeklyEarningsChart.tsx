import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyEarning } from "../useWalletTotals";

interface WeeklyEarningsChartProps {
  data?: WeeklyEarning[];
  isLoading?: boolean;
}

export function WeeklyEarningsChart({
  data,
  isLoading,
}: WeeklyEarningsChartProps) {
  const chartData =
    data?.map((item) => ({
      name: `Week ${item.week}`,
      value: item.total,
    })) || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-50 p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-sm text-slate-800 border-b-2 border-slate-800 pb-1 inline-block">
          Earning Per Week for the Year
        </h3>
      </div>
      <div className="h-[250px] w-full mt-4 flex items-center justify-center">
        {isLoading ? (
          <div className="text-slate-400 font-medium">Loading chart...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#81a1c1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#81a1c1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={true}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
                angle={-60}
                textAnchor="end"
                height={60}
                interval={Math.floor(chartData.length / 10)}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="linear"
                dataKey="value"
                stroke="#6b8fae"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{
                  r: 6,
                  fill: "#fff",
                  stroke: "#6b8fae",
                  strokeWidth: 2,
                }}
                dot={{ r: 3, fill: "#fff", stroke: "#6b8fae", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
