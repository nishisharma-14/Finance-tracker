import { cn } from "../../lib/utils";

const badgeVariants = {
  default: "bg-[var(--foreground)] text-[var(--background)]",
  income: "bg-[var(--color-income)]/10 text-[var(--color-income)]",
  expense: "bg-[var(--color-expense)]/10 text-[var(--color-expense)]",
  secondary: "bg-[var(--border)] text-[var(--foreground)]",
};

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
