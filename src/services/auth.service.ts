import { User, Session } from '@/models/user.model';
import { supabase } from '@/core/supabase/client';

const mapSupabaseUser = (sbUser: any): User => ({
  id: sbUser.id,
  email: sbUser.email!,
  name: sbUser.user_metadata?.full_name || sbUser.email!.split('@')[0],
  avatarUrl: sbUser.user_metadata?.avatar_url || `https://picsum.photos/seed/${sbUser.email}/200/200`,
});

export const authService = {
  async login(email: string, password: string): Promise<Session> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
      }
      throw new Error(error.message);
    }

    if (!data.session) {
      throw new Error('Falha ao instanciar a sessão.');
    }

    return {
      user: mapSupabaseUser(data.user),
      accessToken: data.session.access_token,
    };
  },

  async loginWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });

    if (error) throw new Error(error.message);
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) return null;

    return {
      user: mapSupabaseUser(session.user),
      accessToken: session.access_token,
    };
  },

  getCurrentUserId(): string | null {
    throw new Error('Utilize o useAuthStore para capturar o ID síncrono da sessão ativa.');
  },

  async register(name: string, email: string, password: string): Promise<Session> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) throw new Error(error.message);

    if (!data.session) {
      // Supabase Email Confirmations are enabled by default on new projects
      // The session is null until they click the verification link
      throw new Error('Conta criada! Por favor, verifique sua caixa de entrada para confirmar o e-mail antes de logar.');
    }

    return {
      user: mapSupabaseUser(data.user),
      accessToken: data.session.access_token,
    };
  },

  async sendPasswordResetEmail(email: string): Promise<void> {
    // Ignoramos o erro propositalmente — nunca revelamos se o email existe ou não.
    // Esta é uma medida de segurança contra a enumeração de emails (user enumeration).
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      // Mapeamos os erros do Supabase para mensagens claras e sem detalhes técnicos
      if (error.message.toLowerCase().includes('expired') || error.message.toLowerCase().includes('invalid')) {
        throw new Error('Link de recuperação inválido ou expirado. Solicita um novo.');
      }
      throw new Error('Erro ao actualizar a palavra-passe. Tenta novamente.');
    }
  },
};
