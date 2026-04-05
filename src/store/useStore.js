import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialTransactions = [
  { id: '1', date: '2026-04-01', amount: 4500, category: 'Salary', type: 'income', description: 'Tech Corp Monthly Salary' },
  { id: '2', date: '2026-04-02', amount: 85, category: 'Food', type: 'expense', description: 'Whole Foods Market' },
  { id: '3', date: '2026-04-03', amount: 45, category: 'Transport', type: 'expense', description: 'Uber Rides' },
  { id: '4', date: '2026-04-04', amount: 120, category: 'Utilities', type: 'expense', description: 'Electric Bill' },
  { id: '5', date: '2026-03-28', amount: 300, category: 'Shopping', type: 'expense', description: 'Amazon Purchases' },
  { id: '6', date: '2026-03-29', amount: 1500, category: 'Freelance', type: 'income', description: 'UI Design Client' },
  { id: '7', date: '2026-03-25', amount: 65, category: 'Food', type: 'expense', description: 'DoorDash Delivery' },
  { id: '8', date: '2026-03-22', amount: 200, category: 'Health', type: 'expense', description: 'Pharmacy & Meds' },
  { id: '9', date: '2026-03-15', amount: 4500, category: 'Salary', type: 'income', description: 'Tech Corp Monthly Salary' },
  { id: '10', date: '2026-03-12', amount: 400, category: 'Travel', type: 'expense', description: 'Weekend Flight' },
  { id: '11', date: '2026-03-10', amount: 95, category: 'Entertainment', type: 'expense', description: 'Concert Tickets' },
  { id: '12', date: '2026-03-08', amount: 55, category: 'Food', type: 'expense', description: 'Coffee Shop' },
  { id: '13', date: '2026-03-05', amount: 1200, category: 'Rent', type: 'expense', description: 'Monthly Apartment Rent' },
  { id: '14', date: '2026-03-02', amount: 250, category: 'Shopping', type: 'expense', description: 'New Monitor' },
  { id: '15', date: '2026-02-28', amount: 180, category: 'Utilities', type: 'expense', description: 'Internet & Water' },
  { id: '16', date: '2026-02-25', amount: 75, category: 'Food', type: 'expense', description: 'Grocery Store' },
  { id: '17', date: '2026-02-20', amount: 4500, category: 'Salary', type: 'income', description: 'Tech Corp Monthly Salary' },
  { id: '18', date: '2026-02-18', amount: 60, category: 'Transport', type: 'expense', description: 'Train Pass' },
  { id: '19', date: '2026-02-15', amount: 300, category: 'Freelance', type: 'income', description: 'Logo Design Setup' },
  { id: '20', date: '2026-02-12', amount: 45, category: 'Entertainment', type: 'expense', description: 'Netflix & Spotify' },
  { id: '21', date: '2026-02-10', amount: 85, category: 'Food', type: 'expense', description: 'Sushi Dinner' },
  { id: '22', date: '2026-02-05', amount: 1200, category: 'Rent', type: 'expense', description: 'Monthly Apartment Rent' },
  { id: '23', date: '2026-01-29', amount: 450, category: 'Shopping', type: 'expense', description: 'Winter Clothes' },
  { id: '24', date: '2026-01-25', amount: 120, category: 'Health', type: 'expense', description: 'Dental Checkup' },
  { id: '25', date: '2026-01-20', amount: 4500, category: 'Salary', type: 'income', description: 'Tech Corp Monthly Salary' },
  { id: '26', date: '2026-01-18', amount: 200, category: 'Transport', type: 'expense', description: 'Car Maintenance' },
  { id: '27', date: '2026-01-15', amount: 600, category: 'Freelance', type: 'income', description: 'Consulting Call' },
  { id: '28', date: '2026-01-12', amount: 110, category: 'Food', type: 'expense', description: 'Stock up groceries' },
  { id: '29', date: '2026-01-08', amount: 1200, category: 'Rent', type: 'expense', description: 'Monthly Apartment Rent' },
  { id: '30', date: '2026-01-05', amount: 90, category: 'Utilities', type: 'expense', description: 'Heating Bill' },
  { id: '31', date: '2026-01-02', amount: 50, category: 'Entertainment', type: 'expense', description: 'Game Purchase' },
  { id: '32', date: '2026-04-05', amount: 35, category: 'Food', type: 'expense', description: 'Lunch' },
  { id: '33', date: '2026-03-25', amount: 8000, category: 'Utilities', type: 'expense', description: 'Major Server Crash Repairs' },
  { id: '34', date: '2026-04-04', amount: 6500, category: 'Shopping', type: 'expense', description: 'Unexpected Legal Fees' }
];

export const useStore = create(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'ADMIN', // 'VIEWER' or 'ADMIN'
      displayName: 'Admin User',
      theme: 'light', // 'light' or 'dark'
      themeStyle: 'standard', // 'standard' or 'oled'
      accentColor: 'indigo', // 'indigo', 'emerald', 'rose', 'amber'
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
      setThemeStyle: (style) => set({ themeStyle: style }),
      setAccentColor: (color) => set({ accentColor: color }),
      setDisplayName: (displayName) => set({ displayName }),
      
      monthlyBudget: 5000,
      setMonthlyBudget: (budget) => set({ monthlyBudget: Number(budget) || 0 }),
      
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'vaultfi-storage-v3',
    }
  )
);
