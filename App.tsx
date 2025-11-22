import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { AIAdvisor } from './components/AIAdvisor';
import { Transaction, TransactionType } from './types';
import { LayoutDashboard, List, Wallet } from 'lucide-react';

// Default Categories
const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Lazer',
  'Saúde',
  'Salário',
  'Investimentos',
  'Outros'
];

const App: React.FC = () => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (description: string, amount: number, type: TransactionType, category: string, date: string) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount,
      type,
      category,
      date
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 p-2 rounded-lg">
                <Wallet className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Finanças AI</h1>
            </div>
            
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === 'dashboard' 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === 'transactions' 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <List size={18} />
                Transações
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* AI Advisor Section - Always visible for quick access */}
        <AIAdvisor transactions={transactions} />

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
             <Dashboard transactions={transactions} />
             
             {/* Quick Add embedded in Dashboard for ease of use */}
             <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Adicionar Rápido</h3>
                <TransactionForm 
                    onAddTransaction={addTransaction} 
                    categories={DEFAULT_CATEGORIES} 
                />
             </div>
          </div>
        )}

        {/* Transactions View */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            <TransactionForm 
                onAddTransaction={addTransaction} 
                categories={DEFAULT_CATEGORIES} 
            />
            <TransactionList 
                transactions={transactions} 
                onDelete={deleteTransaction} 
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;