export function TopStatCard({
  title,
  value,
  accentClass,
}: {
  title: string;
  value: string;
  accentClass: string;
}) {
  return (
    <div className="bg-white rounded-[16px] px-[32px] py-[10px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex flex-col justify-center relative overflow-hidden h-30">
      {/* Accent Bar */}
      <div
        className={`absolute left-0 top-1/3 -translate-y-1/2 h-14 w-[6px] rounded-r-full ${accentClass}`}
      />
      <div className=" space-y-2">
        <h3 className="text-[#8e8ea1] text-lg font-medium tracking-tight">
          {title}
        </h3>
        <p className="text-[#1e1b39] text-[24px] font-bold tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
