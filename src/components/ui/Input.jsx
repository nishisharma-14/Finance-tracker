import { cn } from "../../lib/utils";
import { forwardRef } from "react";

export const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-[outline:none] focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 text-sm text-slate-800 dark:text-slate-100 focus-visible:outline-none focus-[outline:none] focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export const Label = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label
      className={cn(
        "text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-1.5 block peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </label>
  );
});
Label.displayName = "Label";
