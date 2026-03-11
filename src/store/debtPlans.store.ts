import { create } from 'zustand';
import { DebtPlan } from '@/models/debtPlan.model';
import { DebtPlansService } from '@/services/debtPlans.service';
import { CreateDebtPlanRequest } from '@/mappers/debtPlans.dto';
import { useAuthStore } from '@/store/auth.store';

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
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true, error: undefined });
    try {
      const items = await DebtPlansService.listDebtPlans(userId);
      set({ items, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch debt plans:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar planos'
      });
      set({ items: [] });
    }
  },

  fetchDebtPlanDetails: async (id: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true, error: undefined });
    try {
      const selected = await DebtPlansService.getDebtPlanById(userId, id);
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
    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('Utilizador não autenticado');

    set({ isLoading: true, error: undefined });
    try {
      const newPlan = await DebtPlansService.createDebtPlan(userId, payload);
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
    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('Utilizador não autenticado');

    set({ isLoading: true, error: undefined });
    try {
      const updatedPlan = await DebtPlansService.updateDebtPlan(userId, id, updates);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedPlan : item)),
        selected: state.selected?.id === id ? updatedPlan : state.selected,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to update plan:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar plano'
      });
      throw error;
    }
  },

  registerInstallmentPayment: async (id: string, quantity: number = 1) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('Utilizador não autenticado');

    set({ isLoading: true, error: undefined });
    try {
      const updatedPlan = await DebtPlansService.registerInstallmentPayment(userId, id, quantity);
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
