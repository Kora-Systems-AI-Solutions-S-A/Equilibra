import { create } from 'zustand';
import { DebtPlan } from '../models/debtPlan.model';
import { DebtPlansService } from '../services/debtPlans.service';
import { CreateDebtPlanRequest } from '../mappers/debtPlans.dto';

interface DebtPlansState {
  items: DebtPlan[];
  selected?: DebtPlan;
  isLoading: boolean;
  error?: string;

  fetchDebtPlans: () => Promise<void>;
  fetchDebtPlanDetails: (id: string) => Promise<void>;
  createDebtPlan: (payload: CreateDebtPlanRequest) => Promise<void>;
  updatePlan: (id: string, updates: Partial<DebtPlan>) => Promise<void>;
  registerInstallmentPayment: (id: string, quantity?: number) => Promise<void>;
}

export const useDebtPlansStore = create<DebtPlansState>((set, get) => ({
  items: [],
  selected: undefined,
  isLoading: false,
  error: undefined,

  fetchDebtPlans: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const items = await DebtPlansService.listDebtPlans();
      set({ items, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch debt plans:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erro ao carregar planos' 
      });
      // Fallback to empty state as requested
      set({ items: [] });
    }
  },

  fetchDebtPlanDetails: async (id: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const selected = await DebtPlansService.getDebtPlanById(id);
      set({ selected, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch debt plan details:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erro ao carregar detalhes' 
      });
    }
  },

  createDebtPlan: async (payload: CreateDebtPlanRequest) => {
    set({ isLoading: true, error: undefined });
    try {
      const newPlan = await DebtPlansService.createDebtPlan(payload);
      set((state) => ({ 
        items: [newPlan, ...state.items],
        isLoading: false 
      }));
    } catch (error) {
      console.error('Failed to create debt plan:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erro ao criar plano' 
      });
      throw error;
    }
  },

  updatePlan: async (id: string, updates: Partial<DebtPlan>) => {
    // This is a mock for now as there's no specific update endpoint mentioned in the prompt
    // but we need it for the UI logic (readjust plan)
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      selected: state.selected?.id === id ? { ...state.selected, ...updates } : state.selected,
    }));
  },

  registerInstallmentPayment: async (id: string, quantity: number = 1) => {
    set({ isLoading: true, error: undefined });
    try {
      const updatedPlan = await DebtPlansService.registerInstallmentPayment(id, quantity);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedPlan : item)),
        selected: state.selected?.id === id ? updatedPlan : state.selected,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to register payment:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erro ao registrar pagamento' 
      });
      throw error;
    }
  },
}));
