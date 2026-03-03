import { create } from 'zustand';

export interface InvestmentPlan {
  id: string;
  name: string;
  totalValue: number;
  icon: string; // 'Globe' | 'Landmark' | 'Building2'
  color: string;
  type?: string;
  startDate?: string;
}

interface InvestmentsState {
  investments: InvestmentPlan[];
  addContribution: (planId: string, amount: number, date: string, note?: string) => void;
  addInvestment: (investment: { name: string; type: string; initialValue: number; startDate: string }) => void;
}

export const useInvestmentsStore = create<InvestmentsState>((set) => ({
  investments: [
    { id: '1', name: 'ETF Global (IVVB11)', totalValue: 15420.00, icon: 'Globe', color: 'bg-blue-100 text-blue-600', type: 'ETF', startDate: '2023-01-10' },
    { id: '2', name: 'Reserva de Emergência', totalValue: 8000.00, icon: 'Landmark', color: 'bg-orange-100 text-orange-600', type: 'Poupança', startDate: '2022-05-15' },
    { id: '3', name: 'Fundos Imobiliários', totalValue: 5120.50, icon: 'Building2', color: 'bg-purple-100 text-purple-600', type: 'FII', startDate: '2023-03-20' },
  ],
  addContribution: (planId, amount) => set((state) => ({
    investments: state.investments.map((inv) => 
      inv.id === planId ? { ...inv, totalValue: inv.totalValue + amount } : inv
    )
  })),
  addInvestment: (investment) => set((state) => {
    const icons = ['Globe', 'Landmark', 'Building2'];
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-orange-100 text-orange-600',
      'bg-purple-100 text-purple-600',
      'bg-emerald-100 text-emerald-600'
    ];
    
    const newInvestment: InvestmentPlan = {
      id: Math.random().toString(36).substring(2, 9),
      name: investment.name,
      totalValue: investment.initialValue,
      type: investment.type,
      startDate: investment.startDate,
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    
    return {
      investments: [...state.investments, newInvestment]
    };
  }),
}));
