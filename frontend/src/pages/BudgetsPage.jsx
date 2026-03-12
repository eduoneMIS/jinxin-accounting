import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudgetStore, useCategoryStore } from '../stores';

export default function BudgetsPage() {
  const navigate = useNavigate();
  const { budgets, alerts, fetchBudgets, fetchAlerts, addBudget, deleteBudget } = useBudgetStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudget, setNewBudget] = useState({ amount: '', category_id: null, month: selectedMonth, year: selectedYear });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBudgets(selectedMonth, selectedYear);
    fetchAlerts(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addBudget({ ...newBudget, amount: parseFloat(newBudget.amount) });
    setShowAddModal(false);
    setNewBudget({ amount: '', category_id: null, month: selectedMonth, year: selectedYear });
    fetchAlerts(selectedMonth, selectedYear);
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-800">
            ← 返回
          </button>
          <h1 className="text-xl font-bold">💸 預算管理</h1>
          <button onClick={() => setShowAddModal(true)} className="text-blue-600 font-medium">
            新增
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
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

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">⚠️ 預算警示</h2>
            {alerts.map((alert) => (
              <div
                key={alert.budget.id}
                className={`p-4 rounded-xl mb-2 ${
                  alert.is_over ? 'bg-red-50 border border-red-200' : 
                  alert.percent >= 80 ? 'bg-orange-50 border border-orange-200' : 
                  'bg-green-50 border border-green-200'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {alert.budget.category ? `${alert.budget.category.icon} ${alert.budget.category.name}` : '💰 總預算'}
                  </span>
                  <span className={`font-bold ${alert.is_over ? 'text-red-600' : 'text-gray-700'}`}>
                    ${alert.spent.toLocaleString()} / ${alert.budget.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      alert.is_over ? 'bg-red-500' : alert.percent >= 80 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(alert.percent, 100)}%` }}
                  />
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  {alert.is_over 
                    ? `⚠️ 已超支 $${Math.abs(alert.remaining).toLocaleString()}` 
                    : `剩餘 $${alert.remaining.toLocaleString()} (${(100 - alert.percent).toFixed(0)}%)`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Budget List */}
        {budgets.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">💸</p>
            <p>尚未設定本月預算</p>
          </div>
        ) : (
          <div className="space-y-2">
            {budgets.map((b) => (
              <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {b.category ? `${b.category.icon} ${b.category.name}` : '💰 總預算'}
                  </p>
                  <p className="text-sm text-gray-500">{b.year} 年 {b.month} 月</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">${b.amount.toLocaleString()}</span>
                  <button onClick={() => deleteBudget(b.id)} className="text-gray-400 hover:text-red-600">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4">設定預算</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">預算類型</label>
                  <select
                    value={newBudget.category_id || ''}
                    onChange={(e) => setNewBudget({ 
                      ...newBudget, 
                      category_id: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">💰 總預算（所有支出）</option>
                    {expenseCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
                  <input
                    type="number"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="5000"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 bg-gray-100 rounded-lg"
                  >
                    取消
                  </button>
                  <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg">
                    儲存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
