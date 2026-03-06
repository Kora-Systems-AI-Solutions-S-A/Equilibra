/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export type ExpandedModalType = 'debts' | 'income' | 'monthlySummary' | 'investments';
export type DrawerOrigin = 'dashboard' | 'modal';
export type RegisterModalContext = 'dashboard' | 'monthlySummary';

export interface DashboardFilters {
  types: ('income' | 'expense')[];
  period: string;
}

interface UIState {
  isRegisterModalOpen: boolean;
  isAddPlanModalOpen: boolean;
  isCreateInvestmentModalOpen: boolean;
  investmentContributionModal: {
    isOpen: boolean;
    planId: string | null;
  };
  planDrawer: {
    isOpen: boolean;
    planId: string | null;
    openedFrom: DrawerOrigin | null;
  };
  sidebarCollapsed: boolean;
  expandedModal: { type: ExpandedModalType; cardId?: string } | null;
  dashboardFilters: DashboardFilters;
  registerModalContext: RegisterModalContext;
  
  openRegisterModal: (context?: RegisterModalContext) => void;
  closeRegisterModal: () => void;
  
  openAddPlanModal: () => void;
  closeAddPlanModal: () => void;

  openCreateInvestmentModal: () => void;
  closeCreateInvestmentModal: () => void;

  openInvestmentContributionModal: (planId: string) => void;
  closeInvestmentContributionModal: () => void;
  
  openPlanDrawer: (id: string, openedFrom: DrawerOrigin) => void;
  closePlanDrawer: () => void;
  
  toggleSidebar: () => void;
  openExpandedModal: (type: ExpandedModalType, cardId?: string) => void;
  closeExpandedModal: () => void;
  setDashboardFilters: (filters: Partial<DashboardFilters>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isRegisterModalOpen: false,
  isAddPlanModalOpen: false,
  isCreateInvestmentModalOpen: false,
  investmentContributionModal: {
    isOpen: false,
    planId: null,
  },
  planDrawer: {
    isOpen: false,
    planId: null,
    openedFrom: null,
  },
  sidebarCollapsed: true,
  expandedModal: null,
  dashboardFilters: {
    types: ['income', 'expense'],
    period: 'Este Mês'
  },
  registerModalContext: 'dashboard',
  
  openRegisterModal: (context = 'dashboard') => set({ isRegisterModalOpen: true, registerModalContext: context }),
  closeRegisterModal: () => set({ isRegisterModalOpen: false }),
  
  openAddPlanModal: () => set({ isAddPlanModalOpen: true }),
  closeAddPlanModal: () => set({ isAddPlanModalOpen: false }),

  openCreateInvestmentModal: () => set({ isCreateInvestmentModalOpen: true }),
  closeCreateInvestmentModal: () => set({ isCreateInvestmentModalOpen: false }),

  openInvestmentContributionModal: (planId: string) => set({ 
    investmentContributionModal: { isOpen: true, planId } 
  }),
  closeInvestmentContributionModal: () => set({ 
    investmentContributionModal: { isOpen: false, planId: null } 
  }),
  
  openPlanDrawer: (id: string, openedFrom: DrawerOrigin) => set({ 
    planDrawer: { isOpen: true, planId: id, openedFrom } 
  }),
  closePlanDrawer: () => set((state) => ({ 
    planDrawer: { ...state.planDrawer, isOpen: false, planId: null } 
  })),
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  openExpandedModal: (type, cardId) => set({ expandedModal: { type, cardId } }),
  closeExpandedModal: () => set({ expandedModal: null }),
  setDashboardFilters: (filters) => set((state) => ({ 
    dashboardFilters: { ...state.dashboardFilters, ...filters } 
  })),
}));
