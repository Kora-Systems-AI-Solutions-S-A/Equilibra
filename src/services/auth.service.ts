import { User, Session } from '@/models/user.model';

const SESSION_KEY = 'equilibra_session';

const MOCK_USER: User = {
  id: '1',
  email: 'rodrigomac.rb@gmail.com',
  name: 'Rodrigo Mac',
  avatarUrl: 'https://picsum.photos/seed/user/200/200',
};

const MOCK_SESSION: Session = {
  user: MOCK_USER,
  accessToken: 'mock-jwt-token',
};

export const authService = {
  async login(email: string, password: string): Promise<Session> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple mock validation
    if (email && password.length >= 6) {
      const session: Session = {
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
          avatarUrl: `https://picsum.photos/seed/${email}/200/200`,
        },
        accessToken: 'mock-jwt-token-' + Date.now(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    }

    throw new Error('Credenciais inválidas. Tente novamente.');
  },

  async loginWithGoogle(): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const session: Session = {
      user: {
        id: '1',
        email: 'google.user@example.com',
        name: 'Google User',
        avatarUrl: 'https://picsum.photos/seed/google/200/200',
      },
      accessToken: 'mock-google-token-' + Date.now(),
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // In a real OAuth flow, this would redirect, but here we just simulate success
    window.location.reload(); 
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.removeItem(SESSION_KEY);
  },

  async getSession(): Promise<Session | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (sessionStr) {
      try {
        return JSON.parse(sessionStr) as Session;
      } catch {
        return null;
      }
    }
    return null;
  },

  getCurrentUserId(): string | null {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    try {
      const session = JSON.parse(sessionStr) as Session;
      return session.user.id;
    } catch {
      return null;
    }
  },

  async register(name: string, email: string, password: string): Promise<Session> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const session: Session = {
      user: {
        id: '1',
        email,
        name,
        avatarUrl: `https://picsum.photos/seed/${name}/200/200`,
      },
      accessToken: 'mock-jwt-token-reg-' + Date.now(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },
};
