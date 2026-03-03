/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export type ExpandedModalType = 'debts' | 'income' | 'monthlySummary' | 'investments';
export type DrawerOrigin = 'dashboard' | 'modal';

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
  
  openRegisterModal: () => void;
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
  
  openRegisterModal: () => set({ isRegisterModalOpen: true }),
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
}));
