import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationStore } from '@/store/notification.store';

// Duração do cooldown em segundos após reenvio de email
const COOLDOWN_SECONDS = 60;

interface AuthConfirmationViewProps {
  type: 'email' | 'reset' | 'email-validated';
  email?: string;
  onBack: () => void;
}

export const AuthConfirmationView: React.FC<AuthConfirmationViewProps> = ({ type, email, onBack }) => {
  const { resendConfirmationEmail, isLoading } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const [cooldown, setCooldown] = useState(0);

  // Decrementa o contador de cooldown a cada segundo
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isLoading || !email) return;

    try {
      await resendConfirmationEmail(email);
      showNotification('Email de confirmação reenviado com sucesso.', 'success');
      setCooldown(COOLDOWN_SECONDS);
    } catch (err: any) {
      showNotification(err.message || 'Erro ao reenviar email.', 'error');
    }
  }, [cooldown, isLoading, email, resendConfirmationEmail, showNotification]);

  const isEmail = type === 'email';
  const isValidated = type === 'email-validated';
  const canResend = cooldown <= 0 && !isLoading;

  return (
    <div className="w-full max-w-[340px] mx-auto flex flex-col justify-start">
      <div className="mb-6 sm:mb-8 text-center">
        {/* Ícone animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
        >
          {isEmail ? (
            <Mail className="w-8 h-8 text-primary" />
          ) : isValidated ? (
            <CheckCircle className="w-8 h-8 text-primary" />
          ) : (
            <Lock className="w-8 h-8 text-primary" />
          )}
        </motion.div>

        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[24px] sm:text-[28px] leading-[1.05] font-black tracking-tight mb-3 text-white"
        >
          {isEmail ? 'Verifique o seu email' : isValidated ? 'Conta confirmada' : 'Email enviado'}
        </motion.h2>

        {/* Mensagem */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[13px] sm:text-[14px] text-slate-400 leading-relaxed font-medium"
        >
          {isEmail ? (
            <>
              Enviámos um email de confirmação para{' '}
              <strong className="text-slate-300">{email}</strong>.
              <br />
              Verifique a sua caixa de entrada e clique no link para ativar a sua conta.
            </>
          ) : isValidated ? (
            <>
              O seu endereço de email foi confirmado com sucesso.
              <br />
              Pode agora iniciar sessão na sua conta.
            </>
          ) : (
            <>
              Se o email estiver registado, receberá as instruções de recuperação em breve.
              Verifique a sua caixa de entrada.
            </>
          )}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {/* Botão principal — voltar ao login */}
        <Button
          type="button"
          onClick={onBack}
          className="w-full h-12 sm:h-14 rounded-xl text-[14px] font-black shadow-[0_20px_40px_rgba(74,222,128,0.25)] hover:shadow-[0_24px_48px_rgba(74,222,128,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Voltar ao Login
        </Button>

        {/* Reenvio de email — apenas para confirmação de email */}
        {isEmail && email && (
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
        )}
      </motion.div>
    </div>
  );
};
