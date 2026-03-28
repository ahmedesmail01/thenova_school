import { cn } from "../../lib/utils";

export default function Card({
  children,
  className,
  title,
  extra,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-[20px] p-6 border border-dash-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        className,
      )}
    >
      {(title || extra) && (
        <div className="flex justify-between items-center mb-6">
          {title && (
            <h3 className="text-lg font-bold text-[#1a2d42]">{title}</h3>
          )}
          {extra}
        </div>
      )}
      {children}
    </div>
  );
}
