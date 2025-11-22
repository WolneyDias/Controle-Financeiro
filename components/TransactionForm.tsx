import React, { useState } from 'react';
import { TransactionType } from '../types';
import { PlusCircle } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (description: string, amount: number, type: TransactionType, category: string, date: string) => void;
  categories: string[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, categories }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState(categories[0] || 'Outros');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    onAddTransaction(description, parseFloat(amount), type, category, date);
    
    // Reset form
    setDescription('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
      <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <PlusCircle size={20} className="text-brand-600" />
        Nova Transação
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* Description */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Descrição</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Compras Supermercado"
            className="w-full rounded-lg border-slate-200 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Valor (R$)</label>
          <input 
            type="number" 
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="w-full rounded-lg border-slate-200 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Tipo</label>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-2.5 text-sm font-medium transition ${type === TransactionType.EXPENSE ? 'bg-red-100 text-red-700' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
              Saída
            </button>
            <div className="w-[1px] bg-slate-200"></div>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-2.5 text-sm font-medium transition ${type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
              Entrada
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Categoria</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border-slate-200 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white"
            >
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>

         {/* Date */}
         <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-slate-600 mb-1">Data</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border-slate-200 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition text-slate-600"
            required
          />
        </div>

        <div className="lg:col-span-5 mt-2">
            <button 
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg transition shadow-sm"
            >
                Adicionar Transação
            </button>
        </div>

      </div>
    </form>
  );
};