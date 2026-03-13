import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthPresentation } from './AuthPresentation';
import { AuthConfirmationView } from './AuthConfirmationView';
import { LoginForm } from '@/features/auth/forms/LoginForm';
import { RegisterForm } from '@/features/auth/forms/RegisterForm';
import { ForgotPasswordForm } from '@/features/auth/forms/ForgotPasswordForm';
import { useAuthStore } from '@/store/auth.store';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Animação subtil para transições entre formulários e ecrãs de confirmação
const formTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' as const },
};

export const AuthContainer = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const { authStep, lastRegisteredEmail, setAuthStep } = useAuthStore();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const toggleMode = (newMode: 'login' | 'register' | 'forgot-password') => {
    // Ao trocar de modo, resetar o authStep para o formulário
    setAuthStep('form');
    setMode(newMode);
  };

  // Callback para voltar ao login a partir dos ecrãs de confirmação
  const handleBackToLogin = () => {
    setAuthStep('form');
    setMode('login');
  };

  // Determina a chave única para as transições AnimatePresence
  const contentKey = `${mode}-${authStep}`;

  // Determina se o painel de apresentação deve estar na posição de login
  const isPresentationLogin = mode === 'login' && authStep === 'form';

  // Renderiza o conteúdo do formulário ativo com base no modo e authStep
  const renderFormContent = () => {
    // Ecrãs de confirmação têm prioridade sobre os formulários
    if (authStep === 'email-confirmation') {
      return (
        <AuthConfirmationView
          type="email"
          email={lastRegisteredEmail || undefined}
          onBack={handleBackToLogin}
        />
      );
    }

    if (authStep === 'email-validated') {
      return (
        <AuthConfirmationView
          type="email-validated"
          onBack={handleBackToLogin}
        />
      );
    }

    if (authStep === 'reset-confirmation') {
      return (
        <AuthConfirmationView
          type="reset"
          onBack={handleBackToLogin}
        />
      );
    }
    
    if (authStep === 'password-reset-success') {
      return (
        <AuthConfirmationView
          type="password-reset-success"
          onBack={handleBackToLogin}
        />
      );
    }

    // Formulários normais
    switch (mode) {
      case 'login':
        return <LoginForm onToggleMode={toggleMode} mode={mode} />;
      case 'register':
        return <RegisterForm onToggleMode={toggleMode} mode={mode} />;
      case 'forgot-password':
        return <ForgotPasswordForm onToggleMode={toggleMode} mode={mode} />;
    }
  };

  // Determina a posição do formulário ativo (login fica à direita no desktop, restantes à esquerda)
  const isLoginForm = mode === 'login' && authStep === 'form';

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 25%, rgba(34, 197, 94, 0.10), transparent 35%),
          radial-gradient(circle at 78% 72%, rgba(16, 185, 129, 0.06), transparent 30%),
          linear-gradient(180deg, #060908 0%, #050706 100%)
        `
      }}
    >
      {/* Subtle Grain/Noise Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full min-h-screen flex"
      >
        {/* Presentation Panel — estável durante transições, desliza apenas com o modo */}
        <motion.div
          initial={false}
          animate={{
            left: isPresentationLogin ? '0%' : '40%',
          }}
          transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
          className="hidden md:flex absolute inset-y-0 w-[60%] z-20"
        >
          <AuthPresentation isLogin={isPresentationLogin} />
        </motion.div>

        {/* Área do formulário — com AnimatePresence para transições suaves */}
        <motion.div
          initial={false}
          animate={{
            left: isMobile ? '0%' : (isLoginForm ? '60%' : '0%'),
            width: isMobile ? '100%' : '40%',
          }}
          transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-y-0 flex flex-col items-center justify-center p-6 md:p-12 z-30"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              initial={formTransition.initial}
              animate={formTransition.animate}
              exit={formTransition.exit}
              transition={formTransition.transition}
              className="w-full flex flex-col items-center justify-center"
            >
              {renderFormContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.main>
    </div>
  );
};
