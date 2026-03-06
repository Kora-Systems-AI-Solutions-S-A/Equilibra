import { create } from 'zustand';
import { InvestmentPlan } from '@/models/investmentPlan.model';
import * as investmentService from '@/services/investmentPlans.service';
import { CreateInvestmentPlanRequest } from '@/mappers/investmentPlans.dto';

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
    set({ isLoading: true, error: undefined });
    try {
      const data = await investmentService.listInvestmentPlans();
      set({ investments: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchInvestmentPlanById: async (id: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const data = await investmentService.getInvestmentPlanById(id);
      set({ selectedInvestment: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createInvestmentPlan: async (payload: CreateInvestmentPlanRequest) => {
    set({ isLoading: true, error: undefined });
    try {
      const newPlan = await investmentService.createInvestmentPlan(payload);
      set((state) => ({ 
        investments: [...state.investments, newPlan],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addContribution: async (planId: string, amount: number, date: string, note?: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const updatedPlan = await investmentService.addInvestmentContribution(planId, amount);
      set((state) => ({
        investments: state.investments.map(inv => inv.id === planId ? updatedPlan : inv),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
