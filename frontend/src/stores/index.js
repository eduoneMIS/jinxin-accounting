import { create } from 'zustand';
import { authAPI, transactionsAPI, categoriesAPI, budgetsAPI } from '../api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const { data } = await authAPI.login(formData);
    localStorage.setItem('token', data.access_token);
    set({ token: data.access_token, isAuthenticated: true });
    await get().fetchUser();
    return data;
  },
  
  register: async (username, email, password) => {
    const { data } = await authAPI.register({ username, email, password });
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  fetchUser: async () => {
    try {
      const { data } = await authAPI.getMe();
      set({ user: data });
    } catch {
      get().logout();
    }
  },
}));

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  summary: { income: 0, expense: 0, balance: 0 },
  loading: false,
  
  fetchTransactions: async () => {
    set({ loading: true });
    try {
      const { data } = await transactionsAPI.getAll();
      set({ transactions: data });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchSummary: async (year, month) => {
    const { data } = await transactionsAPI.getSummary({ year, month });
    set({ summary: data });
  },
  
  addTransaction: async (transaction) => {
    const { data } = await transactionsAPI.create(transaction);
    set((state) => ({ transactions: [data, ...state.transactions] }));
    return data;
  },
  
  updateTransaction: async (id, transaction) => {
    const { data } = await transactionsAPI.update(id, transaction);
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? data : t)),
    }));
    return data;
  },
  
  deleteTransaction: async (id) => {
    await transactionsAPI.delete(id);
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },
}));

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  
  fetchCategories: async (type) => {
    set({ loading: true });
    try {
      const { data } = await categoriesAPI.getAll(type);
      set({ categories: data });
    } finally {
      set({ loading: false });
    }
  },
  
  addCategory: async (category) => {
    const { data } = await categoriesAPI.create(category);
    set((state) => ({ categories: [...state.categories, data] }));
    return data;
  },
}));

export const useBudgetStore = create((set) => ({
  budgets: [],
  alerts: [],
  loading: false,
  
  fetchBudgets: async (month, year) => {
    set({ loading: true });
    try {
      const { data } = await budgetsAPI.getAll({ month, year });
      set({ budgets: data });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchAlerts: async (month, year) => {
    const { data } = await budgetsAPI.getAlerts({ month, year });
    set({ alerts: data });
  },
  
  addBudget: async (budget) => {
    const { data } = await budgetsAPI.create(budget);
    set((state) => ({ budgets: [...state.budgets, data] }));
    return data;
  },
  
  deleteBudget: async (id) => {
    await budgetsAPI.delete(id);
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    }));
  },
}));
