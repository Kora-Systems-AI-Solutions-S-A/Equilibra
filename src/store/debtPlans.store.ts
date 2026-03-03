import { create } from 'zustand';

export type DebtPriority = 'Alta' | 'Média' | 'Baixa';

export interface DebtPlan {
  id: string;
  name: string;
  totalValue: number;
  monthlyPayment: number;
  startMonthYear: string;
  predictedEndMonthYear: string;
  installmentsTotal: number;
  installmentsPaid: number;
  remainingValue: number;
  progressPercent: number;
  priority: DebtPriority;
}

interface DebtPlansState {
  plans: DebtPlan[];
  addPlan: (plan: Omit<DebtPlan, 'id'>) => void;
  updatePlan: (id: string, updates: Partial<DebtPlan>) => void;
  registerPayment: (id: string, monthsCount?: number) => void;
}

export const useDebtPlansStore = create<DebtPlansState>((set) => ({
  plans: [
    {
      id: '1',
      name: 'Financiamento Imobiliário',
      totalValue: 450000,
      monthlyPayment: 2500,
      startMonthYear: '01/2023',
      predictedEndMonthYear: '12/2037',
      installmentsTotal: 180,
      installmentsPaid: 14,
      remainingValue: 415000,
      progressPercent: 7.7,
      priority: 'Alta',
    },
    {
      id: '2',
      name: 'Cartão de Crédito Platinum',
      totalValue: 15000,
      monthlyPayment: 1000,
      startMonthYear: '10/2025',
      predictedEndMonthYear: '12/2026',
      installmentsTotal: 15,
      installmentsPaid: 6,
      remainingValue: 9000,
      progressPercent: 40,
      priority: 'Média',
    },
  ],
  addPlan: (p) => set((state) => ({
    plans: [
      { ...p, id: Math.random().toString(36).substring(7) },
      ...state.plans,
    ],
  })),
  updatePlan: (id, updates) => set((state) => ({
    plans: state.plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  registerPayment: (id, monthsCount = 1) => set((state) => ({
    plans: state.plans.map((p) => {
      if (p.id === id) {
        const newPaid = Math.min(p.installmentsTotal, p.installmentsPaid + monthsCount);
        const newRemaining = Math.max(0, p.totalValue - (newPaid * p.monthlyPayment));
        const newPercent = (newPaid / p.installmentsTotal) * 100;
        return {
          ...p,
          installmentsPaid: newPaid,
          remainingValue: newRemaining,
          progressPercent: Number(newPercent.toFixed(1)),
        };
      }
      return p;
    }),
  })),
}));
