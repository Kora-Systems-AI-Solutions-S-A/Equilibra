import { create } from 'zustand';
import { MonthlyRecord, MonthlyRecordStatus } from '@/models/monthlyRecord.model';
import { MonthlyRecordsService } from '@/services/monthlyRecords.service';
import { CreateMonthlyRecordRequest, UpdateMonthlyRecordRequest } from '@/mappers/monthlyRecords.dto';
import { getCurrentMonthYear } from '@/lib/date';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationStore } from '@/store/notification.store';

interface MonthlyRecordsState {
  items: MonthlyRecord[];
  allRecords: MonthlyRecord[]; // For trend charts
  isLoading: boolean;
  error?: string;
  selectedMonth: string;
  selectedRecord?: MonthlyRecord;

  fetchMonthlyRecords: (monthRef?: string) => Promise<void>;
  fetchAllRecords: () => Promise<void>;
  createMonthlyRecord: (payload: CreateMonthlyRecordRequest) => Promise<void>;
  updateMonthlyRecord: (id: string, payload: UpdateMonthlyRecordRequest) => Promise<void>;
  markAsPaid: (id: string) => Promise<void>;
  markAsReceived: (id: string) => Promise<void>;
  cancelRecord: (id: string) => Promise<void>;
  setSelectedMonth: (month: string) => void;
  setSelectedRecord: (record?: MonthlyRecord) => void;
  reset: () => void;
}

export const useMonthlyRecordsStore = create<MonthlyRecordsState>((set, get) => ({
  items: [],
  allRecords: [],
  isLoading: false,
  error: undefined,
  selectedMonth: getCurrentMonthYear(),
  selectedRecord: undefined,

  fetchMonthlyRecords: async (monthRef) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const ref = monthRef || get().selectedMonth;
    set({ isLoading: true, error: undefined });
    try {
      const items = await MonthlyRecordsService.listMonthlyRecords(userId, ref);
      set({ items, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar registros';
      set({ isLoading: false, error: message });
      useNotificationStore.getState().showNotification(message, 'error');
    }
  },

  fetchAllRecords: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true, error: undefined });
    try {
      const allRecords = await MonthlyRecordsService.listMonthlyRecords(userId);
      const selectedMonth = get().selectedMonth;

      // Filtra os itens do mês selecionado a partir do histórico completo recém-carregado
      const items = allRecords.filter(record => record.mesReferencia === selectedMonth);

      set({ allRecords, items, isLoading: false });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro ao carregar histórico';
      set({ isLoading: false, error: message });
      useNotificationStore.getState().showNotification(message, 'error');
    }
  },

  createMonthlyRecord: async (payload) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('Utilizador não autenticado');

    set({ isLoading: true, error: undefined });
    try {
      const newItem = await MonthlyRecordsService.createMonthlyRecord(userId, payload);
      // Update allRecords
      set((state) => ({ allRecords: [newItem, ...state.allRecords] }));
      // Only add to list if it matches selected month
      if (newItem.mesReferencia === get().selectedMonth) {
        set((state) => ({ items: [newItem, ...state.items] }));
      }
      set({ isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar registro';
      set({ isLoading: false, error: message });
      useNotificationStore.getState().showNotification(message, 'error');
      throw error;
    }
  },

  updateMonthlyRecord: async (id, payload) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('Utilizador não autenticado');

    set({ isLoading: true, error: undefined });
    try {
      const updated = await MonthlyRecordsService.updateMonthlyRecord(userId, id, payload);
      set((state) => ({
        items: state.items.map(item => item.id === id ? updated : item),
        allRecords: state.allRecords.map(item => item.id === id ? updated : item),
        isLoading: false
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar registro';
      set({ isLoading: false, error: message });
      useNotificationStore.getState().showNotification(message, 'error');
      throw error;
    }
  },

  markAsPaid: async (id) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true, error: undefined });
    try {
      const updated = await MonthlyRecordsService.updateMonthlyRecordStatus(userId, id, 'Pago');
      set((state) => ({
        items: state.items.map(item => item.id === id ? updated : item),
        allRecords: state.allRecords.map(item => item.id === id ? updated : item),
        isLoading: false
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao marcar como pago';
      set({ isLoading: false, error: message });
      useNotificationStore.getState().showNotification(message, 'error');
    }
  },

  markAsReceived: async (id) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true, error: undefined });
    try {
      const updated = await MonthlyRecordsService.updateMonthlyRecordStatus(userId, id, 'Recebido');
      set((state) => ({
        items: state.items.map(item => item.id === id ? updated : item),
        allRecords: state.allRecords.map(item => item.id === id ? updated : item),
        isLoading: false
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao marcar como recebido';
      set({ isLoading: false, error: message });
      useNotificationStore.getState().showNotification(message, 'error');
    }
  },

  cancelRecord: async (id) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true, error: undefined });
    try {
      const updated = await MonthlyRecordsService.cancelMonthlyRecord(userId, id);
      set((state) => ({
        items: state.items.map(item => item.id === id ? updated : item),
        allRecords: state.allRecords.map(item => item.id === id ? updated : item),
        isLoading: false
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao cancelar registro';
      set({ isLoading: false, error: message });
      useNotificationStore.getState().showNotification(message, 'error');
    }
  },

  setSelectedMonth: (month) => {
    set({ selectedMonth: month });
    get().fetchMonthlyRecords(month);
  },

  setSelectedRecord: (record) => set({ selectedRecord: record }),

  reset: () => set({
    items: [],
    allRecords: [],
    isLoading: false,
    error: undefined,
    selectedMonth: getCurrentMonthYear(),
    selectedRecord: undefined
  }),
}));
