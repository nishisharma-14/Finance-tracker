import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { useStore } from './store/useStore';

import { SettingsView } from './views/SettingsView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme, themeStyle, accentColor } = useStore();

  useEffect(() => {
    // Theme Mode
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // OLED Midnight Mode
    if (themeStyle === 'oled') {
      document.body.classList.add('oled');
    } else {
      document.body.classList.remove('oled');
    }
  }, [themeStyle]);

  useEffect(() => {
    // Dynamic Accent Colors
    if (accentColor) {
      document.documentElement.setAttribute('data-accent', accentColor);
    }
  }, [accentColor]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'transactions':
        return <TransactionsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={theme}>
      {/* Aurora Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-colors duration-500">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-500/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-aurora-1 opacity-70 dark:opacity-40"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-primary-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-aurora-2 opacity-60 dark:opacity-30"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-primary-600/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-aurora-3 opacity-70 dark:opacity-40"></div>
      </div>
      
      <Layout activeTab={activeTab} onTabSelect={setActiveTab}>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out text-slate-800 dark:text-slate-100 h-full">
          {renderContent()}
        </div>
      </Layout>
    </div>
  );
}

export default App;
