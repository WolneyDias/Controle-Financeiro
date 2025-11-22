import React from 'react';
import { Transaction, TransactionType } from '../types';
import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
        <p className="text-slate-400">Nenhuma transação registrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-700">Histórico de Transações</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Data</th>
              <th className="px-6 py-3 font-medium">Descrição</th>
              <th className="px-6 py-3 font-medium">Categoria</th>
              <th className="px-6 py-3 font-medium text-right">Valor</th>
              <th className="px-6 py-3 font-medium text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                        {t.type === TransactionType.INCOME ? (
                            <ArrowUpCircle size={16} className="text-emerald-500" />
                        ) : (
                            <ArrowDownCircle size={16} className="text-red-500" />
                        )}
                        {t.description}
                    </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {t.category}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === TransactionType.INCOME ? '+ ' : '- '}
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="text-slate-400 hover:text-red-500 transition p-1"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};