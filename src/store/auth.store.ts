import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { User, Session } from '@/models/user.model';
import { supabase, initialLocationHash, resetInitialHash } from '@/core/supabase/client';
import { useMonthlyRecordsStore } from './monthlyRecords.store';
import { useDebtPlansStore } from './debtPlans.store';
import { useInvestmentsStore } from './investments.store';
import { useNotificationStore } from './notification.store';

export type AuthStep = 'form' | 'email-confirmation' | 'reset-confirmation' | 'email-validated' | 'password-reset-success';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastRegisteredEmail: string | null;
  authStep: AuthStep;

  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  setAuthStep: (step: AuthStep) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  lastRegisteredEmail: null,
  authStep: (initialLocationHash.includes('type=signup') ? 'email-validated' : 'form') as AuthStep,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

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
      // Registo com sucesso — guardar email e transitar para o ecrã de confirmação
      set({
        lastRegisteredEmail: email,
        authStep: 'email-confirmation',
        isLoading: false,
      });
    } catch (error: any) {
      set({
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

  sendPasswordResetEmail: async (email: string) => {
    set({ isLoading: true, error: null });
    // Não fazemos throw — nunca revelamos se o email existe ou não (anti-enumeração)
    await authService.sendPasswordResetEmail(email);
    set({ isLoading: false });
  },

  updatePassword: async (password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.updatePassword(password);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao atualizar senha.',
        isLoading: false,
      });
      throw error;
    }
  },

  resendConfirmationEmail: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resendConfirmationEmail(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao reenviar email de confirmação.',
        isLoading: false,
      });
      throw error;
    }
  },

  setAuthStep: (step: AuthStep) => set({ authStep: step }),

  reset: () => set({ ...initialState, isInitialized: true }),
}));

// Inicializa o listener de mudanças de sessão do Supabase.
// Deve ser chamado UMA ÚNICA VEZ na raiz da aplicação (via useAuthListener).
// Retorna a função de unsubscribe para evitar memory leak.
export const initializeAuthListener = () => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    // Deteção de SIGNED_IN originado por confirmação de email
    // Usamos o initialLocationHash capturado no momento do carregamento do módulo
    const isEmailConfirmation = initialLocationHash.includes('type=signup');

    if (isEmailConfirmation && session) {
      // Reset da variável para evitar redeteções em trocas de sessão na mesma tab
      resetInitialHash();
      // Confirmação de email detetada — não autenticar automaticamente
      // Executar logout imediato e notificar o utilizador via toast
      supabase.auth.signOut().then(() => {
        useAuthStore.setState({ authStep: 'email-validated' });
        useNotificationStore.getState().showNotification(
          'E-mail confirmado com sucesso! Já pode fazer login.',
          'success'
        );
      });

      // Limpar o hash da URL para evitar reprocessamento
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

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
        lastRegisteredEmail: null,
        authStep: ['email-validated', 'password-reset-success'].includes(useAuthStore.getState().authStep) ? useAuthStore.getState().authStep : 'form',
      });
    }
  });

  // Retorna o unsubscribe para ser invocado pelo hook de cleanup
  return () => subscription.unsubscribe();
};
