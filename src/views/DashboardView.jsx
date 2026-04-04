import { useMemo } from "react";
import { ArrowDownIcon, ArrowUpIcon, Activity, CalendarDays, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { formatCurrency, formatDate } from "../lib/utils";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#6366f1"];

export function DashboardView() {
  const transactions = useStore((state) => state.transactions);

  const { totalBalance, income, expenses, incomeChange, expenseChange, categoryData, chartData, recentTransactions, dailyBurnRate, runwayDays } = useMemo(() => {
    let inc = 0, exp = 0;
    const catMap = {};
    const dateMap = {};

    transactions.forEach(t => {
      const amt = Number(t.amount);
      if (t.type === 'income') {
        inc += amt;
      } else {
        exp += amt;
        catMap[t.category] = (catMap[t.category] || 0) + amt;
      }

      const date = t.date.substring(5, 10);
      if (!dateMap[date]) dateMap[date] = { date, income: 0, expense: 0 };
      if (t.type === 'income') dateMap[date].income += amt;
      else dateMap[date].expense += amt;
    });

    const cats = Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    const cData = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
    let runBal = inc - exp;
    const orderedChartData = cData.map(d => {
      const dataPoint = { ...d, balance: runBal };
      runBal = runBal - d.income + d.expense;
      return dataPoint;
    }).reverse();

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    let thisMonthIncome = 0; let lastMonthIncome = 0;
    let thisMonthExpense = 0; let lastMonthExpense = 0;

    transactions.forEach(t => {
      const amt = Number(t.amount);
      const d = new Date(t.date);
      const m = d.getMonth();
      const y = d.getFullYear();

      if (m === thisMonth && y === thisYear) {
        if (t.type === 'income') thisMonthIncome += amt;
        if (t.type === 'expense') thisMonthExpense += amt;
      }
      
      const lM = thisMonth === 0 ? 11 : thisMonth - 1;
      const lY = thisMonth === 0 ? thisYear - 1 : thisYear;
      if (m === lM && y === lY) {
        if (t.type === 'income') lastMonthIncome += amt;
        if (t.type === 'expense') lastMonthExpense += amt;
      }
    });

    const getPercentChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    // --- Predictive Analytics Logic ---
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    let minDate = Date.now();
    let maxDate = Date.now();
    
    if (transactions.length > 0) {
      minDate = Math.min(...transactions.map(t => new Date(t.date).getTime()));
      maxDate = Math.max(...transactions.map(t => new Date(t.date).getTime()));
    }
    
    // Calculate total days of activity, min 1
    const daysActive = Math.max(1, Math.ceil((maxDate - minDate) / MS_PER_DAY));
    const burn = exp / daysActive;
    const runway = burn > 0 ? ((inc - exp) / burn) : null;

    return {
      totalBalance: inc - exp,
      income: inc,
      expenses: exp,
      incomeChange: getPercentChange(thisMonthIncome, lastMonthIncome),
      expenseChange: getPercentChange(thisMonthExpense, lastMonthExpense),
      dailyBurnRate: burn,
      runwayDays: runway,
      categoryData: cats,
      chartData: orderedChartData.length ? orderedChartData : [{ date: "No data", balance: 0 }],
      recentTransactions: transactions.slice(0, 5)
    };
  }, [transactions]);

  const topCategory = categoryData[0]?.name || 'N/A';

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-10 relative">
      {/* Animated Orbs for deep Glassmorphism backdrop */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/20 dark:bg-purple-900/30 rounded-full blur-[100px] animate-[float_10s_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500/20 dark:bg-blue-900/30 rounded-full blur-[120px] animate-[float_15s_infinite_reverse]" />
      </div>

      <div className="flex flex-col gap-1.5 mb-6 md:mb-8">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-slate-800 dark:text-white drop-shadow-sm">System Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium tracking-wide">Live financial streams and insights.</p>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-12 md:grid-cols-2">
        {/* Total Balance (Glass Hero) */}
        <motion.div className="lg:col-span-4 md:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card flex flex-col justify-between h-full group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 md:p-3 bg-white/20 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-white/10 shadow-sm backdrop-blur-md">
                  <Wallet className="h-4 w-4 md:h-5 md:w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-widest uppercase font-heading">Total Output</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 pb-4">
              <div className="text-4xl md:text-5xl font-black text-slate-800 dark:text-slate-50 tracking-tighter drop-shadow-md font-heading break-words">{formatCurrency(totalBalance)}</div>
              <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live aggregation
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Node */}
        <motion.div className="lg:col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card flex flex-col justify-between h-full group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 md:p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl border border-emerald-500/20 backdrop-blur-md">
                  <ArrowUpIcon className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-widest uppercase font-heading">Inbound Volume</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 pb-4">
              <div className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-heading break-words">{formatCurrency(income)}</div>
              <div className={`text-xs md:text-sm font-semibold mt-4 flex items-center gap-1.5 w-fit px-3 py-1 rounded-full border ${incomeChange >= 0 ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-rose-600 bg-rose-500/10 border-rose-500/20"}`}>
                {incomeChange >= 0 ? <TrendingUp className="h-3 w-3 md:h-3.5 md:w-3.5" /> : <TrendingDown className="h-3 w-3 md:h-3.5 md:w-3.5" />}
                {incomeChange >= 0 ? '+' : ''}{incomeChange}% vs last month
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Node */}
        <motion.div className="lg:col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card flex flex-col justify-between h-full group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 md:p-3 bg-rose-500/10 dark:bg-rose-500/20 rounded-2xl border border-rose-500/20 backdrop-blur-md">
                  <ArrowDownIcon className="h-4 w-4 md:h-5 md:w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <CardTitle className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-widest uppercase font-heading">Outbound Volume</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 pb-4">
              <div className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-heading break-words">{formatCurrency(expenses)}</div>
              <div className={`text-xs md:text-sm font-semibold mt-4 flex items-center gap-1.5 w-fit px-3 py-1 rounded-full border ${expenseChange <= 0 ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-rose-600 bg-rose-500/10 border-rose-500/20"}`}>
                {expenseChange <= 0 ? <TrendingDown className="h-3 w-3 md:h-3.5 md:w-3.5" /> : <TrendingUp className="h-3 w-3 md:h-3.5 md:w-3.5" />}
                {expenseChange >= 0 ? '+' : ''}{expenseChange}% vs last month
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 mt-6">
        {/* Trend Area Chart */}
        <motion.div className="lg:col-span-8" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card h-full flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center pb-0">
              <div>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100 tracking-wide font-heading font-bold">Velocity Chart</CardTitle>
                <p className="text-sm text-slate-500 mt-1 font-medium tracking-wide">Historical liquidity fluctuations</p>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[400px] w-full pt-8 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} fontFamily="Plus Jakarta Sans" />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} fontFamily="Plus Jakarta Sans" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.3)', borderRadius: '16px', color: '#0f172a', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold', fontFamily: 'Outfit' }}
                    cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#4f46e5"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorBal)"
                    activeDot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dense Activity View */}
        <motion.div className="lg:col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-card h-full flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl text-slate-800 dark:text-slate-100 tracking-wide font-heading font-bold">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4 pt-2">
                {recentTransactions.map((t) => (
                  <div key={t.id} className="group flex items-center justify-between p-3 rounded-2xl bg-white/30 dark:bg-slate-800/30 hover:bg-white/60 dark:hover:bg-slate-700/50 backdrop-blur-md transition-all border border-white/20 dark:border-white/5 hover:border-white/60 dark:hover:border-white/20 shadow-sm cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl backdrop-blur-sm ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20'}`}>
                        {t.type === 'income' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 font-heading text-sm">{t.description}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <CalendarDays className="w-3 h-3" /> {formatDate(t.date)}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-black font-heading ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && <div className="text-slate-400 text-sm text-center py-6 font-medium">Stream is empty</div>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6">
        <Card className="glass-card border-none bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/40 dark:to-purple-900/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Top Expenditure Vector</div>
                <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  {topCategory !== 'N/A' ? (
                    <>You spend the most on <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{topCategory}</span>.</>
                  ) : "No spending data available yet."}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Flow Ratio</div>
                <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  {expenses > income
                    ? <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1"><ArrowDownIcon className="w-4 h-4" /> Warnings: Outbound exceeds inbound.</span>
                    : income > 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1"><ArrowUpIcon className="w-4 h-4" /> Healthy: You are retaining capital.</span>
                      : "No revenue streams detected."}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Predictive Runway</div>
                <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  {runwayDays === null || runwayDays < 0
                    ? "Infinite runway. System sustained."
                    : <>Burn rate <b>{formatCurrency(dailyBurnRate)}/day</b>. Est. zero balance in <span className={runwayDays < 30 ? "text-rose-500 font-extrabold" : "text-emerald-500 font-extrabold"}>{Math.floor(runwayDays)} days</span>.</>
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
