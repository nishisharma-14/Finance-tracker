import { LayoutDashboard, Receipt, UserCircle, Sun, Moon } from "lucide-react";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";

export function Layout({ children, activeTab, onTabSelect }) {
  const { role, setRole, theme, toggleTheme } = useStore();

  return (
    <div className="min-h-screen flex p-0 md:p-6 gap-6 box-border font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col glass-card rounded-3xl h-[calc(100vh-3rem)] sticky top-6">
        <div className="p-8 pb-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Vault<span className="text-indigo-500 dark:text-indigo-400">Fi</span>
          </h1>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-500" />}
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <button
            onClick={() => onTabSelect('dashboard')}
            className={cn(
              "flex items-center w-full gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
              activeTab === 'dashboard' 
                ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400 ring-1 ring-slate-200/50 dark:ring-white/10" 
                : "text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white"
            )}
          >
            <LayoutDashboard className={cn("h-4 w-4", activeTab === 'dashboard' && "text-indigo-500 dark:text-indigo-400")} />
            Overview
          </button>
          
          <button
            onClick={() => onTabSelect('transactions')}
            className={cn(
              "flex items-center w-full gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
              activeTab === 'transactions' 
                ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400 ring-1 ring-slate-200/50 dark:ring-white/10" 
                : "text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white"
            )}
          >
            <Receipt className={cn("h-4 w-4", activeTab === 'transactions' && "text-indigo-500 dark:text-indigo-400")} />
            Transactions
          </button>
        </nav>
        
        <div className="p-6 border-t border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-3">
            <UserCircle className="h-10 w-10 text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</span>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer hover:text-indigo-600 transition-colors"
                style={{ backgroundColor: theme === 'dark' ? '#1e293b' : 'transparent' }}
              >
                <option value="VIEWER">Viewer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col md:glass-panel md:rounded-3xl h-screen md:h-[calc(100vh-3rem)] overflow-y-auto relative shadow-2xl shadow-indigo-900/5 dark:shadow-black/50 ring-1 ring-slate-200/50 dark:ring-white/10 transition-colors duration-500">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Vault<span className="text-indigo-500 dark:text-indigo-400">Fi</span>
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full">
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-500" />}
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
              activeTab === 'dashboard' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            Overview
          </button>
          <button
            onClick={() => onTabSelect('transactions')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 w-full text-xs font-semibold rounded-lg",
              activeTab === 'transactions' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
            )}
          >
            <Receipt className="h-5 w-5" />
            Transactions
          </button>
        </div>
      </main>
    </div>
  );
}
