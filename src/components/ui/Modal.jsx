import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

export function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className={cn("relative z-[101] w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-800 dark:text-slate-100 rounded-[2rem] shadow-2xl shadow-indigo-900/20 dark:shadow-black/50 border border-slate-200/50 dark:border-white/10 p-8 m-4 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 ease-out", className)}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
