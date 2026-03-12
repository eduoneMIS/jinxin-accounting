import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryStore } from '../stores';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, fetchCategories, addCategory, deleteCategory } = useCategoryStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense', icon: '📁' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addCategory(newCategory);
    setShowAddModal(false);
    setNewCategory({ name: '', type: 'expense', icon: '📁' });
  };

  const handleDelete = async (id) => {
    if (confirm('確定要刪除這個分類嗎？')) {
      await deleteCategory(id);
    }
  };

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-800">
            ← 返回
          </button>
          <h1 className="text-xl font-bold">📁 分類管理</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-blue-600 font-medium"
          >
            新增
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Income Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-green-700 mb-2">💰 收入分類</h2>
          <div className="grid grid-cols-2 gap-2">
            {incomeCategories.map((cat) => (
              <div key={cat.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-600">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-700 mb-2">🛒 支出分類</h2>
          <div className="grid grid-cols-2 gap-2">
            {expenseCategories.map((cat) => (
              <div key={cat.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-600">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4">新增分類</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">類型</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                      className={`flex-1 py-2 rounded-lg ${newCategory.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                    >
                      收入
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                      className={`flex-1 py-2 rounded-lg ${newCategory.type === 'expense' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}
                    >
                      支出
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名稱</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">圖示</label>
                  <input
                    type="text"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    maxLength={2}
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
