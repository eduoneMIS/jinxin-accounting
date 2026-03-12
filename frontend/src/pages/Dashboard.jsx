import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useTransactionStore, useCategoryStore } from '../stores';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, fetchUser } = useAuthStore();
  const { transactions, summary, fetchTransactions, fetchSummary } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchUser();
    fetchCategories();
    fetchTransactions();
    fetchSummary(selectedYear, selectedMonth);
  }, []);

  useEffect(() => {
    fetchSummary(selectedYear, selectedMonth);
    fetchTransactions();
  }, [selectedYear, selectedMonth]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const incomeData = categories
    .filter((c) => c.type === 'income')
    .map((c) => {
      const total = transactions
        .filter((t) => t.category_id === c.id && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: c.name, value: total, icon: c.icon };
    })
    .filter((d) => d.value > 0);

  const expenseData = categories
    .filter((c) => c.type === 'expense')
    .map((c) => {
      const total = transactions
        .filter((t) => t.category_id === c.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: c.name, value: total, icon: c.icon };
    })
    .filter((d) => d.value > 0);

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">💰 金鑫記帳</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">你好，{user?.username}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Month Selector */}
        <div className="flex gap-2 mb-6">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y} 年</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m} 月</option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <p className="text-green-600 text-sm font-medium">收入</p>
            <p className="text-2xl font-bold text-green-700">${summary.income?.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-xl border border-red-200">
            <p className="text-red-600 text-sm font-medium">支出</p>
            <p className="text-2xl font-bold text-red-700">${summary.expense?.toLocaleString()}</p>
          </div>
          <div className={`p-6 rounded-xl border ${summary.balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
            <p className={`text-sm font-medium ${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>結餘</p>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              ${summary.balance?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-4">收入分布</h3>
            {incomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-10">暫無收入資料</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-4">支出分布</h3>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-10">暫無支出資料</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => navigate('/add')}
            className="bg-green-600 text-white py-4 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            ➕ 記收入
          </button>
          <button
            onClick={() => navigate('/add?type=expense')}
            className="bg-red-600 text-white py-4 rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            ➖ 記支出
          </button>
          <button
            onClick={() => navigate('/transactions')}
            className="bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            📋 交易紀錄
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="bg-purple-600 text-white py-4 rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            📁 分類管理
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">最近交易</h3>
            <button
              onClick={() => navigate('/transactions')}
              className="text-blue-600 text-sm hover:underline"
            >
              查看全部
            </button>
          </div>
          <div className="divide-y">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.category?.icon || '📝'}</span>
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-gray-500">
                      {t.category?.name} • {new Date(t.date).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="p-8 text-center text-gray-400">尚無交易紀錄</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
