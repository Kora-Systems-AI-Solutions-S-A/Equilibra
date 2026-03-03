import { create } from 'zustand';

export interface DebtPlan {
  id: string;
  name: string;
  paidPercentage: number;
  totalValue: number;
  remainingValue: number;
}

interface DebtPlansState {
  plans: DebtPlan[];
  addPlan: (plan: Omit<DebtPlan, 'id'>) => void;
}

export const useDebtPlansStore = create<DebtPlansState>((set) => ({
  plans: [
    {
      id: '1',
      name: 'Financiamento Imobiliário',
      paidPercentage: 75,
      totalValue: 450000,
      remainingValue: 112500,
    },
    {
      id: '2',
      name: 'Cartão de Crédito Platinum',
      paidPercentage: 40,
      totalValue: 15000,
      remainingValue: 9000,
    },
  ],
  addPlan: (p) => set((state) => ({
    plans: [
      { ...p, id: Math.random().toString(36).substring(7) },
      ...state.plans,
    ],
  })),
}));
