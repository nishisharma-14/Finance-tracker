import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Coffee, ShoppingBag, Cpu, MonitorPlay, Train, Utensils, DollarSign, Briefcase } from "lucide-react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function getTransactionBrand(description, category) {
  const desc = description.toLowerCase();
  if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('movie')) 
    return { icon: MonitorPlay, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10 dark:bg-rose-500/20', border: 'border-rose-500/20 dark:border-rose-500/30' };
  if (desc.includes('uber') || desc.includes('train') || desc.includes('flight')) 
    return { icon: Train, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', border: 'border-indigo-500/20 dark:border-indigo-500/30' };
  if (desc.includes('coffee') || desc.includes('starbucks')) 
    return { icon: Coffee, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 dark:bg-amber-500/20', border: 'border-amber-500/20 dark:border-amber-500/30' };
  if (desc.includes('whole foods') || desc.includes('grocery') || category === 'Food') 
    return { icon: Utensils, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', border: 'border-emerald-500/20 dark:border-emerald-500/30' };
  if (desc.includes('amazon') || desc.includes('shoes') || desc.includes('clothes') || category === 'Shopping') 
    return { icon: ShoppingBag, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10 dark:bg-orange-500/20', border: 'border-orange-500/20 dark:border-orange-500/30' };
  if (desc.includes('salary') || category === 'Salary') 
    return { icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/20 dark:bg-emerald-500/30', border: 'border-emerald-500/30 dark:border-emerald-500/40' };
  if (desc.includes('freelance') || desc.includes('consulting') || category === 'Freelance') 
    return { icon: Briefcase, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', border: 'border-cyan-500/20 dark:border-cyan-500/30' };
  
  // Default fallback
  return { icon: Cpu, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-500/10 dark:bg-slate-800/50', border: 'border-slate-500/20 dark:border-slate-500/30' };
}
