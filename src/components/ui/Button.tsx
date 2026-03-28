interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants: Record<string, string> = {
  primary: "bg-brand-blue-btn text-white hover:bg-brand-blue-light",
  outline: "border border-white/30 text-white hover:bg-white/10",
  ghost: "text-text-secondary hover:text-white",
};
const sizes: Record<string, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
