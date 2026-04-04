import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialTransactions = [
  { id: '1', date: '2026-04-01', amount: 3500, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: '2026-04-02', amount: 120, category: 'Food', type: 'expense', description: 'Groceries' },
  { id: '3', date: '2026-04-03', amount: 45, category: 'Transport', type: 'expense', description: 'Fuel' },
  { id: '4', date: '2026-04-04', amount: 200, category: 'Utilities', type: 'expense', description: 'Electricity Bill' },
  { id: '5', date: '2026-04-05', amount: 50, category: 'Entertainment', type: 'expense', description: 'Movie Tickets' },
  { id: '6', date: '2026-04-06', amount: 80, category: 'Food', type: 'expense', description: 'Restaurant' },
  { id: '7', date: '2026-04-07', amount: 150, category: 'Shopping', type: 'expense', description: 'New Shoes' },
  { id: '8', date: '2026-04-08', amount: 500, category: 'Freelance', type: 'income', description: 'Web Design Project' },
];

export const useStore = create(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'VIEWER', // 'VIEWER' or 'ADMIN'
      theme: 'light', // 'light' or 'dark'
      sortBy: 'date',
      sortDirection: 'desc',
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [{ ...transaction, id: crypto.randomUUID() }, ...state.transactions]
      })),
      
      editTransaction: (id, updatedTransaction) => set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      })),

      setSortConfig: (sortBy, sortDirection) => set({ sortBy, sortDirection }),
      setRole: (role) => set({ role }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);
