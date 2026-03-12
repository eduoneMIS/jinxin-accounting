import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecurringStore, useCategoryStore } from '../stores';

export default function RecurringPage() {
  const navigate = useNavigate();
  const { recurring, fetchRecurring, addRecurring, toggleRecurring, executeRecurring, deleteRecurring } = useRecurringStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecurring, setNewRecurring] = useState({
    amount: '',
    description: '',
    type: 'expense',
    category_id: null,
    frequency: 'monthly',
    start_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRecurring();
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addRecurring({
      ...newRecurring,
      amount: parseFloat(newRecurring.amount),
      category_id: parseInt(newRecurring.category_id),
      start_date: new Date(newRecurring.start_date).toISOString()
    });
    setShowAddModal(false);
    setNewRecurring({
      amount: '',
      description: '',
      type: 'expense',
      category_id: null,
      frequency: 'monthly',
      start_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleExecute = async (id) => {
    if (confirm('立即執行這筆定期交易？')) {
      await executeRecurring(id);
      alert('執行成功！');
    }
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');
  const filteredCategories = newRecurring.type === 'income' ? incomeCategories : expenseCategories;

  const freqLabels = { daily: '每天', weekly: '每週', monthly: '每月', yearly: '每年' };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-800">
            ← 返回
          </button>
          <h1 className="text-xl font-bold">🔄 定期支出</h1>
          <button onClick={() => setShowAddModal(true)} className="text-blue-600 font-medium">
            新增
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {recurring.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🔄</p>
            <p>尚未設定定期交易</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recurring.map((r) => (
              <div key={r.id} className={`bg-white p-4 rounded-xl shadow-sm ${!r.is_active ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{r.description}</p>
                    <p className="text-sm text-gray-500">
                      {r.category?.icon} {r.category?.name} • {freqLabels[r.frequency]}
                    </p>
                  </div>
                  <span className={`font-bold ${r.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {r.type === 'income' ? '+' : '-'}${r.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    下次: {new Date(r.next_date).toLocaleDateString('zh-TW')}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExecute(r.id)}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      執行
                    </button>
                    <button
                      onClick={() => toggleRecurring(r.id)}
                      className={`text-xs px-2 py-1 rounded ${r.is_active ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'}`}
                    >
                      {r.is_active ? '暫停' : '啟用'}
                    </button>
                    <button
                      onClick={() => deleteRecurring(r.id)}
                      className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4">新增定期交易</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">類型</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewRecurring({ ...newRecurring, type: 'income', category_id: null })}
                      className={`flex-1 py-2 rounded-lg ${newRecurring.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                    >
                      收入
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRecurring({ ...newRecurring, type: 'expense', category_id: null })}
                      className={`flex-1 py-2 rounded-lg ${newRecurring.type === 'expense' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}
                    >
                      支出
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
                  <input
                    type="number"
                    value={newRecurring.amount}
                    onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">說明</label>
                  <input
                    type="text"
                    value={newRecurring.description}
                    onChange={(e) => setNewRecurring({ ...newRecurring, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="房租、手機費..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
                  <select
                    value={newRecurring.category_id || ''}
                    onChange={(e) => setNewRecurring({ ...newRecurring, category_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">選擇分類</option>
                    {filteredCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">頻率</label>
                  <select
                    value={newRecurring.frequency}
                    onChange={(e) => setNewRecurring({ ...newRecurring, frequency: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="daily">每天</option>
                    <option value="weekly">每週</option>
                    <option value="monthly">每月</option>
                    <option value="yearly">每年</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">起始日</label>
                  <input
                    type="date"
                    value={newRecurring.start_date}
                    onChange={(e) => setNewRecurring({ ...newRecurring, start_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
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
