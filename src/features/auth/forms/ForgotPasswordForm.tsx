import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/ui/Button';
import { FloatingLabelInput } from '@/shared/ui/FloatingLabelInput';
import { motion } from 'motion/react';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { useNotificationStore } from '@/store/notification.store';
import { Mail, ArrowLeft } from 'lucide-react';

// Duração do cooldown em segundos após o envio de um pedido de recuperação
const COOLDOWN_SECONDS = 60;

interface ForgotPasswordFormProps {
  onToggleMode: (mode: 'login' | 'register' | 'forgot-password') => void;
  mode: 'login' | 'register' | 'forgot-password';
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onToggleMode, mode }) => {
  const { sendPasswordResetEmail, isLoading, clearError } = useAuthStore();
  const { setPageTransitionLoading } = useUIStore();
  const { showNotification } = useNotificationStore();
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Limpa o formulário ao sair do modo forgot-password
  useEffect(() => {
    if (mode !== 'forgot-password') {
      setEmail('');
      setIsSuccess(false);
      setCooldown(0);
      clearError();
    }
  }, [mode, clearError]);

  // Decrementa o contador de cooldown a cada segundo
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0 || isLoading) return;

    setPageTransitionLoading(true, 'A processar solicitação...');
    try {
      await sendPasswordResetEmail(email);
      // Mostramos sempre a mesma mensagem — não revelamos se o email existe ou não
      showNotification('Se este email estiver registado, receberás as instruções em breve.', 'success');
      setIsSuccess(true);
      setCooldown(COOLDOWN_SECONDS);
    } finally {
      setPageTransitionLoading(false);
    }
  }, [cooldown, isLoading, email, sendPasswordResetEmail, showNotification, setPageTransitionLoading]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isLoading) return;

    setPageTransitionLoading(true, 'A reenviar...');
    try {
      await sendPasswordResetEmail(email);
      showNotification('Se este email estiver registado, receberás as instruções em breve.', 'success');
      setCooldown(COOLDOWN_SECONDS);
    } finally {
      setPageTransitionLoading(false);
    }
  }, [cooldown, isLoading, email, sendPasswordResetEmail, showNotification, setPageTransitionLoading]);

  // --- Estado de sucesso: após envio ---
  if (isSuccess) {
    const canResend = cooldown <= 0 && !isLoading;

    return (
      <div className="w-full max-w-[340px] mx-auto flex flex-col justify-start">
        <div className="mb-6 sm:mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
          >
            <Mail className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[24px] sm:text-[28px] leading-[1.05] font-black tracking-tight mb-3 text-white"
          >
            Verifique o seu email
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[13px] sm:text-[14px] text-slate-400 leading-relaxed font-medium"
          >
            Se <strong className="text-slate-300">{email}</strong> estiver registado, enviámos um link de recuperação. Siga as instruções no email para redefinir a palavra-passe.
          </motion.p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => onToggleMode('login')}
            className="w-full h-12 sm:h-14 rounded-xl text-[14px] font-black shadow-[0_20px_40px_rgba(74,222,128,0.25)] hover:shadow-[0_24px_48px_rgba(74,222,128,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Voltar ao Login
          </Button>

          {/* Botão de reenvio com feedback do cooldown */}
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className="w-full text-[12px] sm:text-[13px] font-bold text-slate-500 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors py-2"
          >
            {cooldown > 0
              ? `Reenviar em ${cooldown}s`
              : 'Não recebeu o email? Reenviar'
            }
          </button>
        </div>
      </div>
    );
  }

  // --- Estado inicial: formulário de pedido ---
  return (
    <div className="w-full max-w-[340px] mx-auto flex flex-col justify-start">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onToggleMode('login')}
          className="flex items-center gap-2 text-[12px] font-bold text-slate-400 hover:text-white transition-colors mb-6 group inline-flex"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </motion.button>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[28px] sm:text-[32px] leading-[1.05] font-black tracking-tight mb-3 text-white"
        >
          Recuperar conta
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[13px] sm:text-[14px] text-slate-400 leading-relaxed font-medium"
        >
          Insira o endereço de email da sua conta e enviaremos as instruções de recuperação.
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="space-y-3 sm:space-y-4">
          <FloatingLabelInput
            label="Endereço de Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            icon={<Mail size={20} />}
          />
        </div>

        <div className="space-y-3 sm:space-y-4 pt-2">
          <Button
            type="submit"
            disabled={isLoading || cooldown > 0}
            className="w-full h-12 sm:h-14 rounded-xl text-[14px] font-black shadow-[0_20px_40px_rgba(74,222,128,0.25)] hover:shadow-[0_24px_48px_rgba(74,222,128,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_20px_40px_rgba(74,222,128,0.25)] disabled:cursor-not-allowed"
          >
            {isLoading ? 'A processar...' : cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Enviar instruções'}
          </Button>
        </div>
      </form>
    </div>
  );
};
