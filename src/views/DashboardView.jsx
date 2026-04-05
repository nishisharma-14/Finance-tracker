import { useMemo } from "react";
import { ArrowDownIcon, ArrowUpIcon, Activity, CalendarDays, Wallet, TrendingUp, TrendingDown, Sparkles, LineChart, History } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { useCountUp } from "../hooks/useCountUp";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { formatCurrency, formatDate, getTransactionBrand } from "../lib/utils";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#6366f1"];

export function DashboardView() {
  const transactions = useStore((state) => state.transactions);
  const monthlyBudget = useStore((state) => state.monthlyBudget);

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
    let runBal = 0;
    const orderedChartData = cData.map(d => {
      runBal += (d.income - d.expense);
      const [m, day] = d.date.split('-');
      const monthStr = new Date(2026, parseInt(m)-1, 1).toLocaleString('en-US', { month: 'short' });
      return { ...d, balance: runBal, month: monthStr };
    });

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
  const budgetRunwayDays = dailyBurnRate > 0 && monthlyBudget > 0 ? (monthlyBudget / dailyBurnRate) : null;
  const animatedBalance = useCountUp(totalBalance);
  const animatedIncome = useCountUp(income);
  const animatedExpenses = useCountUp(expenses);

  const topCategory = categoryData[0]?.name || 'N/A';

  const maxBal = Math.max(...chartData.map(d => d.balance), 0);
  const minBal = Math.min(...chartData.map(d => d.balance), 0);
  const range = maxBal - minBal;
  const gradientOffset = range === 0 ? 0 : (maxBal / range);
  
  const totalFlow = income + expenses;
  const incomePct = totalFlow === 0 ? 0 : (income / totalFlow) * 100;
  const expensePct = totalFlow === 0 ? 0 : (expenses / totalFlow) * 100;

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-10 relative">
      {/* Animated Orbs for deep Glassmorphism backdrop */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-500/20 dark:bg-primary-600/30 rounded-full blur-[100px] animate-[float_10s_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary-400/20 dark:bg-primary-500/30 rounded-full blur-[120px] animate-[float_15s_infinite_reverse]" />
      </div>

      <div className="flex flex-col gap-1.5 mb-6 md:mb-8">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-slate-800 dark:text-white drop-shadow-sm flex items-center gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/30 text-white">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          Financial Dashboard
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium tracking-wide">Track your overall financial summary and spending patterns.</p>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-12 md:grid-cols-2">
        {/* Total Balance (Glass Hero) */}
        <motion.div className="lg:col-span-4 md:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card tilt-card flex flex-col justify-between h-full group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 md:p-3 bg-white/20 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-white/10 shadow-sm backdrop-blur-md">
                  <Wallet className="h-4 w-4 md:h-5 md:w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <CardTitle className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-widest uppercase font-heading">Total Balance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 pb-4">
              <div className="text-4xl md:text-5xl font-black text-slate-800 dark:text-slate-50 tracking-tighter drop-shadow-md font-heading break-words tabular-nums">{formatCurrency(animatedBalance)}</div>
              <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Balance
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Node */}
        <motion.div className="lg:col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card tilt-card flex flex-col justify-between h-full group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 md:p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl border border-emerald-500/20 backdrop-blur-md">
                  <ArrowUpIcon className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-widest uppercase font-heading">Total Income</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 pb-4">
              <div className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-heading break-words tabular-nums">{formatCurrency(animatedIncome)}</div>
              <div className={`text-xs md:text-sm font-semibold mt-4 flex items-center gap-1.5 w-fit px-3 py-1 rounded-full border ${incomeChange >= 0 ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-rose-600 bg-rose-500/10 border-rose-500/20"}`}>
                {incomeChange >= 0 ? <TrendingUp className="h-3 w-3 md:h-3.5 md:w-3.5" /> : <TrendingDown className="h-3 w-3 md:h-3.5 md:w-3.5" />}
                {incomeChange >= 0 ? '+' : ''}{incomeChange}% vs last month
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Node */}
        <motion.div className="lg:col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card tilt-card flex flex-col justify-between h-full group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 md:p-3 bg-rose-500/10 dark:bg-rose-500/20 rounded-2xl border border-rose-500/20 backdrop-blur-md">
                  <ArrowDownIcon className="h-4 w-4 md:h-5 md:w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <CardTitle className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-widest uppercase font-heading">Total Expenses</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 pb-4">
              <div className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-heading break-words tabular-nums">{formatCurrency(animatedExpenses)}</div>
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
            <CardHeader className="flex flex-row justify-between items-center pb-0 mt-2">
              <div>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100 tracking-wide font-heading font-bold flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-500/20 shadow-sm backdrop-blur-md">
                    <LineChart className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  Your Balance Trend
                </CardTitle>
                <p className="text-sm text-slate-500 mt-2 font-medium tracking-wide">A simple view of how your money is growing</p>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[400px] w-full pt-8 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={gradientOffset} stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset={gradientOffset} stopColor="#f43f5e" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset={`${gradientOffset * 100}%`} stopColor="#10b981" stopOpacity={0.0} />
                      <stop offset={`${gradientOffset * 100}%`} stopColor="#f43f5e" stopOpacity={0.0} />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} fontFamily="Plus Jakarta Sans" minTickGap={30} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} fontFamily="Plus Jakarta Sans" />
                   <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.3)', borderRadius: '16px', color: '#0f172a', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold', fontFamily: 'Outfit' }}
                    cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="url(#splitColor)"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorBal)"
                    activeDot={{ r: 8, fill: '#0f172a', stroke: '#fff', strokeWidth: 3 }}
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
            <CardHeader className="flex flex-row justify-between items-center bg-white/40 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-700/50 pb-4 mb-2 rounded-t-3xl">
              <CardTitle className="text-xl text-slate-800 dark:text-slate-100 tracking-wide font-heading font-bold flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-500/20 shadow-sm backdrop-blur-md">
                  <History className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4 pt-2">
                {recentTransactions.map((t) => {
                  const brand = getTransactionBrand(t.description, t.category);
                  const Icon = brand.icon;
                  return (
                  <div key={t.id} className="group flex items-center justify-between p-3 rounded-2xl bg-white/30 dark:bg-slate-800/30 hover:bg-white/60 dark:hover:bg-slate-700/50 backdrop-blur-md transition-all border border-white/20 dark:border-white/5 hover:border-white/60 dark:hover:border-white/20 shadow-sm cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl backdrop-blur-sm border ${brand.bg} ${brand.color} ${brand.border}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 font-heading text-sm">{t.description}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                          <CalendarDays className="w-3 h-3" /> {formatDate(t.date)}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-black font-heading ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </div>
                  </div>
                )})}
                {recentTransactions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <Wallet className="w-12 h-12 text-slate-400 mb-3" />
                    <span className="text-sm font-bold tracking-wide text-slate-500">Stream is empty</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights Row Overhaul */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6">
        <Card className="glass-card border-none bg-gradient-to-br from-slate-100 to-primary-50/50 dark:from-slate-800/40 dark:to-primary-900/20 relative overflow-hidden shadow-inner ring-1 ring-white/50 dark:ring-white/10">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary-500 to-primary-600 shadow-[0_0_15px_rgba(var(--primary-500),0.5)] z-10"></div>
          
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-heading tracking-tight flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </div>
              Smart Wealth Analytics
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-0">
              
              {/* Doughnut Box */}
              <div className="lg:col-span-4 flex flex-col justify-center bg-white/40 dark:bg-slate-900/40 rounded-2xl p-4 border border-white/40 dark:border-white/5 relative h-48 md:h-56">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 absolute top-4 left-4 z-10">Spending Breakdown</div>
                <div className="flex-1 w-full h-full relative mt-2">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={4} dataKey="value" stroke="none">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '16px', color: '#0f172a', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ color: '#0f172a', fontWeight: 'bold', fontFamily: 'Outfit' }}
                          formatter={(value) => formatCurrency(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <div className="text-sm font-medium text-slate-400 mt-6 absolute text-center w-full">No aggregate data.</div>}
                </div>
              </div>

              {/* Data Metrics Box */}
              <div className="lg:col-span-8 flex flex-col justify-between gap-4">
                
                {/* Visual Ratio Bar */}
                <div className="bg-white/40 dark:bg-slate-900/40 rounded-2xl p-5 border border-white/40 dark:border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Cash Flow Ratio</div>
                    <div className="text-xs font-bold font-heading">
                      <span className="text-emerald-600 dark:text-emerald-400">{incomePct.toFixed(0)}% In</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-rose-600 dark:text-rose-400">{expensePct.toFixed(0)}% Out</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-200/50 dark:bg-slate-800/80 rounded-full overflow-hidden flex shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${incomePct}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-emerald-500 relative">
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                    </motion.div>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${expensePct}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-rose-500"></motion.div>
                  </div>
                  <div className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {expenses > income
                      ? <span className="flex items-center gap-1.5"><ArrowDownIcon className="w-4 h-4 text-rose-500" /> Caution: Outbound volume exceeds inbound retention. High burn state.</span>
                      : income > 0 ? <span className="flex items-center gap-1.5"><ArrowUpIcon className="w-4 h-4 text-emerald-500" /> Stable: You are actively retaining and compounding capital.</span>
                        : "No tracked revenue streams."}
                  </div>
                </div>

                {/* AI Assistant Chat UI */}
                <div className="relative p-5 rounded-2xl bg-primary-50/70 dark:bg-primary-500/10 border border-primary-100/50 dark:border-primary-500/20 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg border border-white/20 shrink-0">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        Smart Advisor
                        <span className="px-1.5 py-0.5 rounded-md bg-primary-100 dark:bg-primary-500/30 text-[9px] font-black tracking-widest">AI</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {dailyBurnRate <= 0
                          ? <>You're doing well! Your capital retention is positive with no significant burn rate. You've spent <b>{formatCurrency(expenses)}</b> this period. Your AI monthly budget threshold is <b className="text-primary-600 dark:text-primary-400 tabular-nums">{formatCurrency(monthlyBudget)}</b>. {expenses > monthlyBudget ? <span className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-bold ml-1">You've exceeded your target.</span> : <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold ml-1">You are safely under budget.</span>}</>
                          : <>Heads up! Right now you are spending an average of <b className="text-slate-900 dark:text-white tabular-nums">{formatCurrency(dailyBurnRate)} a day</b> against a monthly target of <b className="text-primary-600 dark:text-primary-400 tabular-nums">{formatCurrency(monthlyBudget)}</b>. At this velocity, you will exhaust your budget in <span className={budgetRunwayDays < 30 ? "text-rose-600 dark:text-rose-400 font-extrabold bg-rose-500/10 px-1 py-0.5 rounded" : "text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 px-1 py-0.5 rounded"}>{Math.floor(budgetRunwayDays)} days</span>.</>
                        }
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
