import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { User, Session } from '@/models/user.model';
import { supabase } from '@/core/supabase/client';
import { useMonthlyRecordsStore } from './monthlyRecords.store';
import { useDebtPlansStore } from './debtPlans.store';
import { useInvestmentsStore } from './investments.store';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(email, password);
      // O onAuthStateChange cuidará do preenchimento da `session` e `user`
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao entrar. Tente novamente.',
        isLoading: false,
      });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.loginWithGoogle();
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao entrar com Google.',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(name, email, password);
    } catch (error: any) {
      set({
        // Se a confirmação de e-mail estiver ativa, a service fornece o feedback adequado
        error: error.message || 'Erro ao cadastrar. Tente novamente.',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // Bootstrap inicial: verifica a sessão existente uma única vez ao carregar a app.
  // Não configura o listener — esse papel pertence ao initializeAuthListener.
  checkAuth: async () => {
    try {
      const session = await authService.getSession();
      if (session) {
        set({
          session,
          user: session.user,
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
        });
      }
    } catch {
      set({
        session: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

// Inicializa o listener de mudanças de sessão do Supabase.
// Deve ser chamado UMA ÚNICA VEZ na raiz da aplicação (via useAuthListener).
// Retorna a função de unsubscribe para evitar memory leak.
export const initializeAuthListener = () => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      useAuthStore.setState({
        session: {
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatarUrl: session.user.user_metadata?.avatar_url,
          },
          accessToken: session.access_token,
        },
        user: {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatarUrl: session.user.user_metadata?.avatar_url,
        },
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });
    } else {
      // Quando a sessão é encerrada, resetamos todas as stores de domínio
      useMonthlyRecordsStore.getState().reset();
      useDebtPlansStore.getState().reset();
      useInvestmentsStore.getState().reset();

      useAuthStore.setState({
        session: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
    }
  });

  // Retorna o unsubscribe para ser invocado pelo hook de cleanup
  return () => subscription.unsubscribe();
};
