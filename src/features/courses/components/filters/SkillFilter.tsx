import { cn } from "../../../../lib/utils";
import { type Skill } from "../../courseQueries";

interface SkillFilterProps {
  skills: Skill[];
  selectedIds: (number | string)[];
  onToggle: (id: number) => void;
}

export function SkillFilter({
  skills,
  selectedIds,
  onToggle,
}: SkillFilterProps) {
  return (
    <div className="flex flex-col">
      {skills.map((skill) => {
        const isActive = selectedIds.includes(skill.id);
        return (
          <div
            key={skill.id}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer border-b border-[#E9EAF0] last:border-b-0",
              isActive ? "bg-[#F5F7FA]" : "hover:bg-[#F5F7FA]",
            )}
            onClick={() => onToggle(skill.id)}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                readOnly
                className="w-4 h-4 rounded border-[#D1D5DB] text-brand-blue focus:ring-brand-blue cursor-pointer"
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  isActive ? "text-brand-blue font-semibold" : "text-[#4E5566]",
                )}
              >
                {skill.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
