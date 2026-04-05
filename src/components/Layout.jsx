import { LayoutDashboard, Receipt, UserCircle, Sun, Moon, CreditCard, BarChart3, Settings, Zap } from "lucide-react";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";

export function Layout({ children, activeTab, onTabSelect }) {
  const { role, setRole, theme, toggleTheme, displayName } = useStore();

  return (
    <div className="min-h-screen flex p-0 md:p-6 gap-6 box-border font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col glass-card border border-primary-200/50 dark:border-primary-500/20 bg-white/40 dark:bg-slate-900/40 rounded-3xl h-[calc(100vh-3rem)] sticky top-6 shadow-xl shadow-primary-900/5 dark:shadow-black/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none"></div>
        <div className="p-8 pb-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 ring-2 ring-white/50 dark:ring-white/10">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white font-heading">
              Vault<span className="text-primary-500 dark:text-primary-400">Fi</span>
            </h1>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-all shadow-sm">
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-primary-500" />}
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-2 relative z-10">
          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-4 mb-2 mt-4 inline-block">Main Menu</div>
          <button
            onClick={() => onTabSelect('dashboard')}
            className={cn(
              "flex items-center w-full gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
              activeTab === 'dashboard' 
                ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500 dark:border-primary-400 shadow-sm shadow-primary-500/20" 
                : "text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white hover:translate-x-1"
            )}
          >
            <LayoutDashboard className={cn("h-4 w-4 transition-transform", activeTab === 'dashboard' && "scale-110")} />
            Overview
          </button>
          
          <button
            onClick={() => onTabSelect('transactions')}
            className={cn(
              "flex items-center w-full gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
              activeTab === 'transactions' 
                ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500 dark:border-primary-400 shadow-sm shadow-primary-500/20" 
                : "text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white hover:translate-x-1"
            )}
          >
            <Receipt className={cn("h-4 w-4 transition-transform", activeTab === 'transactions' && "scale-110")} />
            Transactions
          </button>

          <button
            onClick={() => onTabSelect('settings')}
            className={cn(
              "flex items-center w-full gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 mt-auto",
              activeTab === 'settings' 
                ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500 dark:border-primary-400 shadow-sm shadow-primary-500/20" 
                : "text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white hover:translate-x-1"
            )}
          >
            <Settings className={cn("h-4 w-4 transition-transform", activeTab === 'settings' && "scale-110")} />
            Settings
          </button>
        </nav>
        
        <div className="p-4 mx-4 mb-4 mt-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-white/5 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-3 relative z-10">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || role)}&background=random&color=fff&bold=true`} alt="Avatar" className="w-10 h-10 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-700 font-heading" />
            <div className="flex flex-col flex-1 truncate">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Access Level</span>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer w-full appearance-none hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{ backgroundColor: theme === 'dark' ? 'transparent' : 'transparent' }}
              >
                <option value="VIEWER" className="bg-white dark:bg-slate-800">Finance Viewer</option>
                <option value="ADMIN" className="bg-white dark:bg-slate-800">Super Admin</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col md:glass-panel md:rounded-3xl h-screen md:h-[calc(100vh-3rem)] overflow-y-auto relative shadow-2xl shadow-primary-900/5 dark:shadow-black/50 ring-1 ring-slate-200/50 dark:ring-white/10 transition-colors duration-500">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Vault<span className="text-primary-500 dark:text-primary-400">Fi</span>
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full">
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-primary-500" />}
            </button>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              style={{ backgroundColor: theme === 'dark' ? '#1e293b' : 'transparent' }}
            >
              <option value="VIEWER">Viewer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 md:p-10 flex-1 max-w-6xl mx-auto w-full">
          {children}
        </div>
        
        {/* Mobile Nav tab bar */}
        <div className="md:hidden sticky bottom-0 border-t border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 flex justify-around z-20 pb-safe">
          <button
            onClick={() => onTabSelect('dashboard')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 w-full text-xs font-semibold rounded-lg",
              activeTab === 'dashboard' ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-500"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            Overview
          </button>
          <button
            onClick={() => onTabSelect('transactions')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 w-full text-xs font-semibold rounded-lg",
              activeTab === 'transactions' ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-500"
            )}
          >
            <Receipt className="h-5 w-5" />
            Transactions
          </button>
          <button
            onClick={() => onTabSelect('settings')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 w-full text-xs font-semibold rounded-lg",
              activeTab === 'settings' ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-500"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </div>
      </main>
    </div>
  );
}
