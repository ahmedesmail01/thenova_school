interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center justify-start sm:justify-center w-full mb-8 overflow-x-auto pb-4 scrollbar-hide px-4">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1 min-w-[40px]">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-all
                ${done ? "bg-white border-brand-blue text-brand-blue" : "bg-white border-brand-blue text-brand-blue"}
                ${active && !done ? "border-brand-blue text-brand-blue bg-brand-navy" : ""}
                ${!done && !active ? "border-brand-border text-text-muted bg-transparent" : ""}`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs whitespace-nowrap text-center ${
                  active || done ? "text-white font-medium" : "text-white/70"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px mx-2 sm:mx-4 min-w-[20px] sm:min-w-[56px] ${
                  i < current ? "bg-white" : "bg-brand-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
