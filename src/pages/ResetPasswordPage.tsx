import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationStore } from '@/store/notification.store';
import { Button } from '@/shared/ui/Button';
import { FloatingLabelInput } from '@/shared/ui/FloatingLabelInput';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { updatePassword, logout, setAuthStep, isLoading, error, clearError } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const initialHash = useRef(window.location.hash);

  // Valida o token da URL e limpa erros ao montar o componente
  useEffect(() => {
    clearError();

    const hashParams = new URLSearchParams(initialHash.current.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    const errorDescription = hashParams.get('error_description');

    if (errorDescription) {
      showNotification('Link expirado. Solicita um novo email de recuperação.', 'error');
      navigate('/');
      return;
    }

    if (type !== 'recovery' || !accessToken) {
      navigate('/');
      return;
    }

    setIsValidating(false);
  }, [clearError, navigate, showNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showNotification('As palavras-passe não coincidem.', 'error');
      return;
    }

    if (password.length < 8) {
      showNotification('A palavra-passe deve ter pelo menos 8 caracteres.', 'error');
      return;
    }

    try {
      await updatePassword(password);
      // Limpa a sessão e define o ecrã de sucesso antes de voltar à AuthPage
      await logout();
      setAuthStep('password-reset-success');
      showNotification('Palavra-passe atualizada com sucesso! Por favor, faça login.', 'success');
      navigate('/');
    } catch (err: any) {
      // Erro mapeado pelo auth.service para mensagem amigável
      showNotification(err.message || 'Erro ao redefinir a palavra-passe.', 'error');
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050706]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-6"
      style={{
        background: `
          radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.15), transparent 50%),
          linear-gradient(180deg, #060908 0%, #050706 100%)
        `
      }}
    >
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[400px] bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 sm:p-10 backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
          >
            <Lock className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[26px] sm:text-[30px] leading-[1.1] font-black tracking-tight mb-3 text-white"
          >
            Nova Palavra-passe
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[13px] sm:text-[14px] text-slate-400 leading-relaxed font-medium"
          >
            Defina uma nova palavra-passe forte e segura para a sua conta.
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3 mb-6"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[11px] font-bold">!</div>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <FloatingLabelInput
                label="Nova Palavra-passe"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                required
                autoComplete="new-password"
                icon={<Lock size={20} />}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <FloatingLabelInput
              label="Confirmar Palavra-passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) clearError();
              }}
              required
              autoComplete="new-password"
              icon={<Lock size={20} />}
            />
          </div>

          <div className="space-y-3 sm:space-y-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 sm:h-14 rounded-xl text-[14px] font-black shadow-[0_20px_40px_rgba(74,222,128,0.25)] hover:shadow-[0_24px_48px_rgba(74,222,128,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_20px_40px_rgba(74,222,128,0.25)]"
            >
              {isLoading ? 'A atualizar...' : 'Atualizar Palavra-passe'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
