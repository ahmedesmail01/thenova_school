import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", rightElement, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-white">{label}</label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`w-full rounded-lg bg-white px-4 py-3 text-gray-900
              placeholder:text-gray-400 outline-none ring-2 ring-transparent
              focus:ring-brand-blue transition-all
              ${rightElement ? "pr-12" : ""}
              ${error ? "ring-red-500" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
