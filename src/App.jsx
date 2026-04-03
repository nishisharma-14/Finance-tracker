import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { useStore } from './store/useStore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={theme}>
      <Layout activeTab={activeTab} onTabSelect={setActiveTab}>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out text-slate-800 dark:text-slate-100">
          {activeTab === 'dashboard' ? <DashboardView /> : <TransactionsView />}
        </div>
      </Layout>
    </div>
  );
}

export default App;
