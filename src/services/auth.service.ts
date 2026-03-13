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
      if (error.status === 400 || error.message.toLowerCase().includes('invalid')) {
        throw new Error('Credenciais inválidas. Verifique o seu email e palavra-passe.');
      }
      throw new Error('Ocorreu um erro ao entrar. Tente novamente.');
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

  async register(name: string, email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) throw new Error(error.message);

    // Registo com sucesso — a confirmação de email está ativa por defeito no Supabase.
    // A sessão será null até o utilizador confirmar o email.
    // O fluxo de transição para o ecrã de confirmação é gerido pela store.
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

  async resendConfirmationEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      // Mapeamos erros do Supabase para mensagens amigáveis
      if (error.message.toLowerCase().includes('rate limit')) {
        throw new Error('Aguarda alguns minutos antes de tentar novamente.');
      }
      throw new Error('Não foi possível reenviar o email. Tenta novamente.');
    }
  },
};
