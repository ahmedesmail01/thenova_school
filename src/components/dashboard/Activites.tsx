import Card from "./Card";
import { Calendar } from "lucide-react";

const Activites = () => {
  return (
    <Card
      title="News & Activities"
      extra={
        <button className="text-[14px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg  tracking-wider">
          Show All
        </button>
      }
    >
      <div className="h-[280px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-300 mb-4 animate-bounce">
          <Calendar size={32} />
        </div>
        <p className="text-sm font-bold text-slate-400">No recent activities</p>
        <p className="text-xs text-slate-300 mt-1 uppercase tracking-widest font-medium">
          Coming soon
        </p>
      </div>
    </Card>
  );
};

export default Activites;
