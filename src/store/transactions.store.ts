import { create } from 'zustand';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  status: 'Pago' | 'Pendente' | 'Recebido';
}

interface TransactionsState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [
    {
      id: '1',
      date: '2023-10-12',
      description: 'Aluguel Residencial',
      category: 'Habitação',
      value: 2400.00,
      type: 'expense',
      status: 'Pago',
    },
    {
      id: '2',
      date: '2023-10-15',
      description: 'Supermercado Atacadão',
      category: 'Alimentação',
      value: 842.50,
      type: 'expense',
      status: 'Pago',
    },
  ],
  addTransaction: (t) => set((state) => ({
    transactions: [
      { ...t, id: Math.random().toString(36).substring(7) },
      ...state.transactions,
    ],
  })),
  updateTransactionStatus: (id, status) => set((state) => ({
    transactions: state.transactions.map(t => t.id === id ? { ...t, status } : t)
  })),
}));
