import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input, Select, Label } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { formatCurrency, formatDate, cn } from "../lib/utils";

const defaultFormState = { id: '', date: '', amount: '', category: 'Food', type: 'expense', description: '' };
const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Salary', 'Freelance', 'Other'];

export function TransactionsView() {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormState);
  const [isEditing, setIsEditing] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      return matchSearch && matchType;
    });
  }, [transactions, searchTerm, filterType]);

  const handleOpenModal = (t = null) => {
    if (t) {
      setFormData(t);
      setIsEditing(true);
    } else {
      setFormData({ ...defaultFormState, date: new Date().toISOString().substring(0, 10) });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.description) return;
    
    if (isEditing) {
      editTransaction(formData.id, { ...formData, amount: Number(formData.amount) });
    } else {
      addTransaction({ ...formData, amount: Number(formData.amount) });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Transactions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Review and manage your financial activity.</p>
        </div>
        
        {role === 'ADMIN' && (
          <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 dark:shadow-indigo-900/50 px-6 rounded-xl font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        )}
      </div>

      <Card className="p-0 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-black/40">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search descriptions or categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 dark:border-white/10 dark:bg-slate-800/50 shadow-sm rounded-xl focus-visible:ring-indigo-500 dark:text-white"
            />
          </div>
          <Select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-[160px] border-slate-200 dark:border-white/10 dark:bg-slate-800/50 shadow-sm rounded-xl font-medium text-slate-700 dark:text-slate-200 focus-visible:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Amount</th>
                {role === 'ADMIN' && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white/40 dark:bg-transparent divide-y divide-slate-100 dark:divide-white/5">
              <AnimatePresence>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <motion.tr 
                      key={t.id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">{formatDate(t.date)}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{t.description}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className={cn(
                          "border-none font-medium px-2.5 py-1",
                          t.category === 'Food' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                          t.category === 'Transport' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                          t.category === 'Salary' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        )}>
                          {t.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={t.type === 'income' ? 'text-emerald-500 font-bold' : 'text-slate-800 dark:text-white font-bold'}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      {role === 'ADMIN' && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(t)} className="h-8 w-8 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteTransaction(t.id)} className="h-8 w-8 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={role === 'ADMIN' ? 5 : 4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No transactions found.</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Try adjusting your filters or search term.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? "Edit Transaction" : "New Transaction"}
        className="dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Type</Label>
              <Select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm focus-visible:ring-indigo-500 dark:text-white"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Date</Label>
              <Input 
                type="date" 
                required 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm focus-visible:ring-indigo-500 dark:text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-300">Description</Label>
            <Input 
              placeholder="E.g. Grocery Shopping" 
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm focus-visible:ring-indigo-500 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="pl-9 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm focus-visible:ring-indigo-500 text-slate-800 dark:text-white font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Category</Label>
              <Select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm focus-visible:ring-indigo-500 dark:text-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:border-slate-600 dark:hover:bg-slate-800">Cancel</Button>
            <Button type="submit" className="rounded-xl px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 dark:shadow-indigo-900/50">{isEditing ? 'Save Changes' : 'Add Transaction'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
