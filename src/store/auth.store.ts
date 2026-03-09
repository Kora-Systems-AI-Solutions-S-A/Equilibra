import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { User, Session } from '@/models/user.model';

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
      const session = await authService.login(email, password);
      set({
        session,
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
      });
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
      const session = await authService.register(name, email, password);
      set({
        session,
        user: session.user,
        isAuthenticated: true,
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
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      const session = await authService.getSession();
      if (session) {
        set({
          session,
          user: session.user,
          isAuthenticated: true,
          isInitialized: true,
        });
      } else {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      set({
        session: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
