import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Presentation } from "lucide-react";
import { Card } from "../components/ui/Card";

export function AnalyticsView() {
  return (
    <div className="space-y-6 pb-20 md:pb-10 h-full flex flex-col">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">Analytics Engine</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Deep dive into your financial metrics and historical data.</p>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <Card className="glass-card max-w-lg w-full p-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl relative rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <BarChart3 className="w-10 h-10 text-white drop-shadow-md" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black font-heading text-slate-800 dark:text-white mb-2">Advanced Analytics</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-center max-w-sm mb-8">
              We are actively training our neural models on your data streams. Deep-dive charting is currently in development.
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm shadow-sm ring-1 ring-slate-200/50 dark:ring-white/10">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-[ping_2s_infinite]"></span>
              Connecting data pipelines...
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
