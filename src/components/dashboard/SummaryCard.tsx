import { Link } from "react-router-dom";

export default function SummaryCard({
  icon: Icon,
  title,
  label,
  showAll,
  iconSrc,
  link,
}: {
  icon?: React.ElementType;
  title: string;
  label: string;
  showAll?: boolean;
  iconSrc?: string;
  link?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-dash-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-2xl  text-blue-600 group-hover:scale-110 transition-transform">
          {iconSrc ? (
            <img src={iconSrc} alt="icon" className="w-[65px]" />
          ) : (
            Icon && <Icon size={24} />
          )}
        </div>
        {showAll && (
          <Link
            to={link || "#"}
            className="text-[14px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider hover:bg-blue-100 transition-colors"
          >
            Show All
          </Link>
        )}
      </div>
      <div>
        <h4 className="text-xl font-semibold text-[#1a2d42] mb-1">{title}</h4>
        <p className="text-xs text-dash-muted  uppercase tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
}
