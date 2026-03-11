import { create } from 'zustand';
import { InvestmentPlan } from '@/models/investmentPlan.model';
import * as investmentService from '@/services/investmentPlans.service';
import { CreateInvestmentPlanRequest } from '@/mappers/investmentPlans.dto';
import { useAuthStore } from './auth.store';

interface InvestmentsState {
  investments: InvestmentPlan[];
  isLoading: boolean;
  error?: string;
  selectedInvestment?: InvestmentPlan;

  fetchInvestmentPlans: () => Promise<void>;
  fetchInvestmentPlanById: (id: string) => Promise<void>;
  createInvestmentPlan: (payload: CreateInvestmentPlanRequest) => Promise<void>;
  addContribution: (planId: string, amount: number, date: string, note?: string) => Promise<void>;
}

export const useInvestmentsStore = create<InvestmentsState>((set) => ({
  investments: [],
  isLoading: false,
  error: undefined,
  selectedInvestment: undefined,

  fetchInvestmentPlans: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      set({ investments: [], isLoading: false });
      return;
    }

    set({ isLoading: true, error: undefined });
    try {
      const data = await investmentService.InvestmentPlansService.listInvestmentPlans(userId);
      set({ investments: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchInvestmentPlanById: async (id: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true, error: undefined });
    try {
      const data = await investmentService.InvestmentPlansService.getInvestmentPlanById(userId, id);
      set({ selectedInvestment: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createInvestmentPlan: async (payload: CreateInvestmentPlanRequest) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      set({ error: 'Usuário não autenticado' });
      return;
    }

    set({ isLoading: true, error: undefined });
    try {
      const newPlan = await investmentService.InvestmentPlansService.createInvestmentPlan(userId, payload);
      set((state) => ({
        investments: [newPlan, ...state.investments],
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addContribution: async (planId: string, amount: number, date: string, note?: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      set({ error: 'Usuário não autenticado' });
      return;
    }

    set({ isLoading: true, error: undefined });
    try {
      const updatedPlan = await investmentService.InvestmentPlansService.addInvestmentContribution(userId, planId, amount, date, note);
      set((state) => ({
        investments: state.investments.map(inv => inv.id === planId ? updatedPlan : inv),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
