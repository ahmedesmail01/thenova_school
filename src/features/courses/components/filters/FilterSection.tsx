import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "../../../../lib/utils";

interface FilterSectionProps {
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FilterSection({
  title,
  isOpen: initialOpen = true,
  children,
  className,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className={cn("border-b border-[#E9EAF0]", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 uppercase font-bold text-[#1D2026] text-sm tracking-tight"
      >
        {title}
        {isOpen ? (
          <ChevronUp size={20} className="text-[#999DA3]" />
        ) : (
          <ChevronDown size={20} className="text-[#999DA3]" />
        )}
      </button>

      {isOpen && <div className="pb-2">{children}</div>}
    </div>
  );
}
