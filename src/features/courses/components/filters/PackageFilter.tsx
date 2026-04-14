import { cn } from "../../../../lib/utils";
import { type RawPackage } from "../../courseQueries";

interface PackageFilterProps {
  packages: RawPackage[];
  selectedIds: (string | number)[];
  onToggle: (id: number) => void;
}

export function PackageFilter({
  packages,
  selectedIds,
  onToggle,
}: PackageFilterProps) {
  return (
    <div className="flex flex-col">
      {packages.map((pkg) => (
        <PackageItem
          key={pkg.id}
          pkg={pkg}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

function PackageItem({
  pkg,
  selectedIds,
  onToggle,
}: {
  pkg: RawPackage;
  selectedIds: (string | number)[];
  onToggle: (id: number) => void;
}) {
  const isActive = selectedIds.includes(pkg.id) || selectedIds.includes(pkg.id.toString());

  return (
    <div className="flex flex-col border-b border-[#E9EAF0] last:border-b-0">
      <div
        className={cn(
          "w-full flex items-center justify-between px-4 py-3.5 transition-colors cursor-pointer",
          isActive ? "bg-[#F5F7FA]" : "hover:bg-[#F5F7FA]",
        )}
        onClick={() => onToggle(pkg.id)}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            readOnly
            className="w-5 h-5 rounded border-[#D1D5DB] text-brand-blue focus:ring-brand-blue cursor-pointer"
          />
          <span
            className={cn(
              "text-sm text-left truncate max-w-[200px] transition-colors",
              isActive ? "text-brand-blue font-semibold" : "text-[#4E5566]",
            )}
          >
            {pkg.name}
          </span>
        </div>
      </div>
    </div>
  );
}
