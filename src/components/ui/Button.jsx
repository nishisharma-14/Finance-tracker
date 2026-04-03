import { cn } from "../../lib/utils";

const variantStyles = {
  default: "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90",
  outline: "border border-[var(--border)] bg-transparent hover:bg-[var(--brand-50)] text-[var(--foreground)]",
  ghost: "bg-transparent hover:bg-[var(--brand-50)] text-[var(--foreground)]",
  danger: "bg-[var(--color-expense)] text-white hover:opacity-90",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 py-2 text-sm",
  icon: "h-10 w-10 flex items-center justify-center",
};

export function Button({ className, variant = "default", size = "md", children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
