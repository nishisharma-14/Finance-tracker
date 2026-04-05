import { motion } from "framer-motion";
import { User, Palette } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input, Label } from "../components/ui/Input";
import { useStore } from "../store/useStore";

export function SettingsView() {
  const { displayName, setDisplayName, theme, toggleTheme, themeStyle, setThemeStyle, accentColor, setAccentColor, monthlyBudget, setMonthlyBudget, notificationsEnabled, setNotificationsEnabled } = useStore();

  return (
    <div className="space-y-6 pb-20 md:pb-10 h-full flex flex-col">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your profile and display preferences.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 max-w-3xl">
        <div className="flex flex-col gap-6">
          
          {/* Profile Settings */}
          <Card className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <User className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading">Profile Information</h3>
            </div>
            
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName"
                  value={displayName || ''} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  placeholder="Enter your name"
                  className="bg-white/50 dark:bg-slate-900/50"
                  maxLength={24}
                />
                <p className="text-xs text-slate-500 mt-1">This name will automatically update your sidebar avatar initials.</p>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="monthlyBudget">Monthly Spending Target ($)</Label>
                <Input 
                  id="monthlyBudget"
                  type="number"
                  value={monthlyBudget || ''} 
                  onChange={(e) => setMonthlyBudget(e.target.value)} 
                  placeholder="e.g. 5000"
                  className="bg-white/50 dark:bg-slate-900/50"
                  min={0}
                />
                <p className="text-xs text-slate-500 mt-1">Your Smart Advisor AI will use this target to analyze your pacing.</p>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Palette className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading">Preferences</h3>
            </div>
            
            <div className="space-y-6 max-w-md">
              <div className="flex flex-col gap-2">
                <div>
                  <Label className="text-base text-slate-800 dark:text-slate-200">Theme Accent</Label>
                  <p className="text-sm text-slate-500 mt-1">Personalize your primary dashboard color.</p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {[
                    { id: 'indigo', bg: 'bg-indigo-500' },
                    { id: 'emerald', bg: 'bg-emerald-500' },
                    { id: 'rose', bg: 'bg-rose-500' },
                    { id: 'amber', bg: 'bg-amber-500' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setAccentColor(c.id)}
                      className={`w-8 h-8 rounded-full ${c.bg} shadow-sm ring-offset-2 dark:ring-offset-slate-900 transition-all ${accentColor === c.id ? 'ring-2 ring-primary-500 scale-110' : 'hover:scale-105 opacity-80'}`}
                      aria-label={`Select ${c.id} theme`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label className="text-base text-slate-800 dark:text-slate-200">Dark Mode Theme</Label>
                  <p className="text-sm text-slate-500 mt-1">Toggle the application visual theme.</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`shrink-0 relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label className="text-base text-slate-800 dark:text-slate-200">OLED Midnight Mode</Label>
                  <p className="text-sm text-slate-500 mt-1">True black background for OLED screens (requires Dark Mode).</p>
                </div>
                <button 
                  onClick={() => setThemeStyle(themeStyle === 'oled' ? 'standard' : 'oled')}
                  disabled={theme !== 'dark'}
                  className={`shrink-0 relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${themeStyle === 'oled' ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'} ${theme !== 'dark' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${themeStyle === 'oled' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label className="text-base text-slate-800 dark:text-slate-200">Push Notifications</Label>
                  <p className="text-sm text-slate-500 mt-1">Receive system alerts for high expenditure.</p>
                </div>
                <button 
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`shrink-0 relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </Card>

        </div>
      </motion.div>
    </div>
  );
}
