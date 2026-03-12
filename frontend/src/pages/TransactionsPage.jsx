import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionStore } from '../stores';

export default function TransactionsPage() {
  const navigate = useNavigate();
  const { transactions, fetchTransactions, deleteTransaction, loading } = useTransactionStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handleDelete = async (id) => {
    if (confirm('確定要刪除這筆交易嗎？')) {
      await deleteTransaction(id);
    }
  };

  const groupedByDate = filteredTransactions.reduce((groups, t) => {
    const date = new Date(t.date).toLocaleDateString('zh-TW');
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-800">
            ← 返回
          </button>
          <h1 className="text-xl font-bold">📋 交易紀錄</h1>
          <button
            onClick={() => navigate('/add')}
            className="text-blue-600 font-medium"
          >
            新增
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? '全部' : f === 'income' ? '收入' : '支出'}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {loading ? (
          <p className="text-center py-8 text-gray-400">載入中...</p>
        ) : Object.keys(groupedByDate).length === 0 ? (
          <p className="text-center py-8 text-gray-400">尚無交易紀錄</p>
        ) : (
          Object.entries(groupedByDate).map(([date, items]) => (
            <div key={date} className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{date}</h3>
              <div className="bg-white rounded-xl shadow-sm divide-y">
                {items.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{t.category?.icon || '📝'}</span>
                      <div className="flex-1">
                        <p className="font-medium">{t.description}</p>
                        <p className="text-sm text-gray-500">{t.category?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
