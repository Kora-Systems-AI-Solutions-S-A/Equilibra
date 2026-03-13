import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/ui/Button';
import { FloatingLabelInput } from '@/shared/ui/FloatingLabelInput';
import { motion } from 'motion/react';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationStore } from '@/store/notification.store';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  onToggleMode: (mode: 'login' | 'register' | 'forgot-password') => void;
  mode: 'login' | 'register' | 'forgot-password';
}

// Validação local de formato de email
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onToggleMode, mode }) => {
  const { sendPasswordResetEmail, setAuthStep, clearError } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpa o formulário ao sair do modo forgot-password
  useEffect(() => {
    if (mode !== 'forgot-password') {
      setEmail('');
      clearError();
    }
  }, [mode, clearError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validação local — feedback exclusivo via toast
    if (!email.trim()) {
      showNotification('Preencha o endereço de email.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Introduza um endereço de email válido.', 'error');
      return;
    }

    // Sem loading global — apenas estado local no botão
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(email);
      // Mostramos sempre a mesma mensagem — não revelamos se o email existe ou não
      showNotification('Se este email estiver registado, receberás as instruções em breve.', 'success');
      // Transição para o ecrã de confirmação via store
      setAuthStep('reset-confirmation');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, email, sendPasswordResetEmail, showNotification, setAuthStep]);

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
            disabled={isSubmitting}
            className="w-full h-12 sm:h-14 rounded-xl text-[14px] font-black shadow-[0_20px_40px_rgba(74,222,128,0.25)] hover:shadow-[0_24px_48px_rgba(74,222,128,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_20px_40px_rgba(74,222,128,0.25)] disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'A processar...' : 'Enviar instruções'}
          </Button>
        </div>
      </form>
    </div>
  );
};
