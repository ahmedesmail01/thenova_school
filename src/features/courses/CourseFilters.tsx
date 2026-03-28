import { useState } from "react";
import { type CourseFiltersType } from "../../features/courses/courseQueries";
import {
  ChevronUp,
  ChevronDown,
  Cpu,
  Handshake,
  Calculator,
  Flag,
  Smile,
  Monitor,
  PenTool,
  Megaphone,
  Box,
  Camera,
  Headphones,
  BriefcaseMedical,
} from "lucide-react";
import { cn } from "../../lib/utils";

const CATEGORIES = [
  {
    name: "Development",
    icon: Cpu,
    sub: [
      { name: "Web development", count: 574 },
      { name: "Data Science", count: 568 },
      { name: "Mobile Development", count: 1345 },
      { name: "Software Testing", count: 317 },
      { name: "Software Engineering", count: 31 },
      { name: "Software Development Tools", count: 558 },
      { name: "No-Code Development", count: 37 },
    ],
  },
  { name: "Business", icon: Handshake, sub: [] },
  { name: "Finance & Accounting", icon: Calculator, sub: [] },
  { name: "IT & Software", icon: Flag, sub: [] },
  { name: "Office Productivity", icon: Smile, sub: [] },
  { name: "Personal Development", icon: Monitor, sub: [] },
  { name: "Design", icon: PenTool, sub: [] },
  { name: "Marketing", icon: Megaphone, sub: [] },
  { name: "Lifestyle", icon: Box, sub: [] },
  { name: "Photography & Video", icon: Camera, sub: [] },
  { name: "Music", icon: Headphones, sub: [] },
  { name: "Health & Fitness", icon: BriefcaseMedical, sub: [] },
];

const TOOLS = [
  { name: "HTML 5", count: 1345 },
  { name: "CSS 3", count: 12736 },
  { name: "React", count: 1345 },
  { name: "Webflow", count: 1345 },
  { name: "Node.js", count: 1345 },
  { name: "Laravel", count: 1345 },
  { name: "Saas", count: 1345 },
  { name: "Wordpress", count: 1345 },
];

interface CourseFiltersProps {
  filters: CourseFiltersType;
  onChange: (f: CourseFiltersType) => void;
}

export function CourseFilters({ filters, onChange }: CourseFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    tools: true,
    level: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleToggle = (key: keyof CourseFiltersType, item: string) => {
    const current = (filters[key] as string[] | undefined) || [];
    const next = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    onChange({ ...filters, [key]: next.length ? next : undefined });
  };

  return (
    <div className="flex flex-col gap-0 border border-[#E9EAF0]">
      {/* Category Section */}
      <div className="border-b border-[#E9EAF0]">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between p-4 uppercase font-bold text-[#1D2026] text-sm tracking-tight"
        >
          CATEGORY
          {openSections.category ? (
            <ChevronUp size={20} className="text-[#999DA3]" />
          ) : (
            <ChevronDown size={20} className="text-[#999DA3]" />
          )}
        </button>

        {openSections.category && (
          <div className="pb-2">
            {CATEGORIES.map((cat) => (
              <CategoryItem
                key={cat.name}
                category={cat}
                selectedItems={filters.categories || []}
                onToggle={(sub) => handleToggle("categories", sub)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tools Section */}
      <div className="border-b border-[#E9EAF0]">
        <button
          onClick={() => toggleSection("tools")}
          className="w-full flex items-center justify-between p-4 uppercase font-bold text-[#1D2026] text-sm tracking-tight"
        >
          TOOLS
          {openSections.tools ? (
            <ChevronUp size={20} className="text-[#999DA3]" />
          ) : (
            <ChevronDown size={20} className="text-[#999DA3]" />
          )}
        </button>

        {openSections.tools && (
          <div className="px-4 pb-4 flex flex-col gap-3">
            {TOOLS.map((tool) => (
              <label
                key={tool.name}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={(filters.tools || []).includes(tool.name)}
                    onChange={() => handleToggle("tools", tool.name)}
                    className="w-5 h-5 rounded border-[#D1D5DB] text-brand-blue focus:ring-brand-blue cursor-pointer"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      (filters.tools || []).includes(tool.name)
                        ? "text-brand-blue font-medium"
                        : "text-[#4E5566] group-hover:text-brand-blue",
                    )}
                  >
                    {tool.name}
                  </span>
                </div>
                <span className="text-xs text-[#999DA3]">
                  {tool.count.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryItem({
  category,
  selectedItems,
  onToggle,
}: {
  category: (typeof CATEGORIES)[0];
  selectedItems: string[];
  onToggle: (name: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(category.name === "Development");
  const hasSub = category.sub.length > 0;
  const isActive = selectedItems.some((item) =>
    category.sub.map((s) => s.name).includes(item),
  );

  return (
    <div className="flex flex-col border-b border-[#E9EAF0] last:border-b-0">
      <button
        onClick={() => hasSub && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3.5 transition-colors",
          isActive ? "bg-[#F5F7FA]" : "hover:bg-[#F5F7FA]",
        )}
      >
        <div className="flex items-center gap-3">
          <category.icon
            size={20}
            className={cn(isActive ? "text-brand-blue" : "text-[#999DA3]")}
          />
          <span
            className={cn(
              "text-sm",
              isActive ? "text-brand-blue font-semibold" : "text-[#4E5566]",
            )}
          >
            {category.name}
          </span>
        </div>
        {hasSub &&
          (isOpen ? (
            <ChevronUp size={16} className="text-brand-blue" />
          ) : (
            <ChevronDown size={16} className="text-[#999DA3]" />
          ))}
      </button>

      {isOpen && hasSub && (
        <div className="flex flex-col gap-3 px-4 pb-4 pt-1">
          {category.sub.map((sub) => (
            <label
              key={sub.name}
              className="flex items-center justify-between cursor-pointer group ml-8"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(sub.name)}
                  onChange={() => onToggle(sub.name)}
                  className="w-5 h-5 rounded border-[#D1D5DB] text-brand-blue focus:ring-brand-blue cursor-pointer"
                />
                <span
                  className={cn(
                    "text-sm",
                    selectedItems.includes(sub.name)
                      ? "text-brand-blue font-medium"
                      : "text-[#4E5566] group-hover:text-brand-blue",
                  )}
                >
                  {sub.name}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs",
                  selectedItems.includes(sub.name)
                    ? "text-[#1D2026] font-bold"
                    : "text-[#999DA3]",
                )}
              >
                {sub.count.toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
