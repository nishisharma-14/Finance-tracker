import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("glass-card rounded-[1.25rem] p-6 flex flex-col gap-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("font-semibold leading-none tracking-tight text-lg text-slate-800 dark:text-slate-100", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
