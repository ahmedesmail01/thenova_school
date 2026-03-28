interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "success"
    | "warning"
    | "error";
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variants = {
    primary: "bg-brand-blue/10 text-brand-blue-light border-brand-blue/20",
    secondary: "bg-brand-surface text-text-secondary border-brand-border",
    outline: "bg-transparent text-text-secondary border-brand-border",
    ghost: "bg-transparent text-text-muted border-transparent",
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-bold border rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
