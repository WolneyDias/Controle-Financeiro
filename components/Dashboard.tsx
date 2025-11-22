import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Transaction, TransactionType, CategoryStats } from '../types';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
        if (!categoryMap[t.category]) categoryMap[t.category] = 0;
        categoryMap[t.category] += t.amount;
      }
    });

    const categoryData: CategoryStats[] = Object.keys(categoryMap).map((cat, index) => ({
      name: cat,
      value: categoryMap[cat],
      color: COLORS[index % COLORS.length]
    }));

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense, categoryData };
  }, [transactions]);

  // Helper to format currency BRL
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const percentageSpent = stats.totalIncome > 0 
    ? ((stats.totalExpense / stats.totalIncome) * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Receitas Totais</p>
            <h3 className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalIncome)}</h3>
          </div>
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Despesas Totais</p>
            <h3 className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpense)}</h3>
            <p className="text-xs text-slate-400 mt-1">{percentageSpent}% da renda</p>
          </div>
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Saldo Atual</p>
            <h3 className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
              {formatCurrency(stats.balance)}
            </h3>
          </div>
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="text-slate-400" size={20} />
            <h3 className="text-lg font-semibold text-slate-700">Despesas por Categoria</h3>
          </div>
          <div className="h-64 w-full">
            {stats.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Sem dados de despesas ainda.
              </div>
            )}
          </div>
        </div>

        {/* Simple Bar Chart for Income vs Expense (Mocked Monthly for simplicity in this view, utilizing current totals) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Fluxo Financeiro</h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Entrada', amount: stats.totalIncome, fill: '#10b981' },
                    { name: 'Saída', amount: stats.totalExpense, fill: '#ef4444' },
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={60} />
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} cursor={{fill: 'transparent'}} />
                  <Bar dataKey="amount" barSize={40} radius={[0, 4, 4, 0]}>
                    {
                        [{ name: 'Entrada', fill: '#10b981' }, { name: 'Saída', fill: '#ef4444' }].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))
                    }
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};