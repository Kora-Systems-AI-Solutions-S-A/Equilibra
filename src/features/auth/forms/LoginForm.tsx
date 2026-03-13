import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { FloatingLabelInput } from '@/shared/ui/FloatingLabelInput';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: (mode: 'login' | 'register' | 'forgot-password') => void;
  mode: 'login' | 'register' | 'forgot-password';
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, mode }) => {
  const { login, loginWithGoogle, error, clearError } = useAuthStore();
  const { setPageTransitionLoading } = useUIStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Limpa o formulário ao alternar entre Login e Cadastro
  useEffect(() => {
    if (mode !== 'login') {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      clearError();
    }
  }, [mode, clearError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageTransitionLoading(true, "A preparar o seu dashboard...");
    try {
      await login(email, password);
    } catch (err) {
      setPageTransitionLoading(false);
      // Error is handled by store
    }
  };

  const handleGoogleLogin = async () => {
    setPageTransitionLoading(true, "A preparar o seu dashboard...");
    try {
      await loginWithGoogle();
    } catch (err) {
      setPageTransitionLoading(false);
      // Error is handled by store
    }
  };

  return (
    <div className="w-full max-w-[340px] mx-auto flex flex-col justify-start">
      <div className="mb-6 sm:mb-8">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-block mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80"
        >
          Acesso seguro
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[28px] sm:text-[32px] leading-[1.05] font-black tracking-tight mb-3 text-white"
        >
          Entrar
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[13px] sm:text-[14px] text-slate-400 leading-relaxed font-medium"
        >
          Entre na sua conta para acompanhar o seu equilíbrio financeiro com elegância.
        </motion.p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
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
          <FloatingLabelInput
            label="Endereço de Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) clearError();
            }}
            required
            autoComplete="email"
            icon={<Mail size={20} />}
          />

          <div className="relative">
            <FloatingLabelInput
              label="Palavra-passe"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) clearError();
              }}
              required
              autoComplete="current-password"
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
        </div>

        <div className="flex items-center justify-between gap-4 py-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-4 h-4 rounded-md border border-white/20 bg-white/[0.04] flex items-center justify-center transition-all group-hover:border-primary/40 group-hover:bg-white/[0.08]">
              <input type="checkbox" className="absolute inset-0 opacity-0 cursor-pointer peer" />
              <div className="w-2 h-2 rounded-sm bg-primary opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100" />
            </div>
            <span className="text-[12px] sm:text-[13px] text-slate-400 group-hover:text-slate-300 transition-colors font-medium">Lembrar de mim</span>
          </label>
          <button type="button" onClick={() => onToggleMode('forgot-password')} className="text-[12px] sm:text-[13px] font-bold text-primary/80 hover:text-white transition-colors">Esqueci a palavra-passe</button>
        </div>

        <div className="space-y-3 sm:space-y-4 pt-2">
          <Button 
            type="submit" 
            className="w-full h-12 sm:h-14 rounded-xl text-[14px] font-black shadow-[0_20px_40px_rgba(74,222,128,0.25)] hover:shadow-[0_24px_48px_rgba(74,222,128,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Entrar no Equilibra
          </Button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-600">ou</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <Button 
            type="button" 
            variant="secondary"
            onClick={handleGoogleLogin}
            className="w-full h-12 sm:h-14 rounded-xl flex items-center justify-center gap-3 group text-[13px] sm:text-[14px]"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </Button>
        </div>

        <p className="text-center text-[13px] text-slate-500 pt-4 font-medium">
          Ainda não tem conta? <button type="button" onClick={() => onToggleMode('register')} className="font-bold text-primary/80 hover:text-white transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-primary">Criar conta</button>
        </p>
      </form>
    </div>
  );
};
