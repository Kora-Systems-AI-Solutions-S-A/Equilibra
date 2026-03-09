import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AuthPresentation } from './AuthPresentation';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';

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

export const AuthContainer = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

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
        {/* Presentation Panel - Hidden on mobile, sliding on md+ */}
        <motion.div
          initial={false}
          animate={{ 
            left: mode === 'login' ? '0%' : '40%',
          }}
          transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
          className="hidden md:flex absolute inset-y-0 w-[60%] z-20"
        >
          <AuthPresentation isLogin={mode === 'login'} />
        </motion.div>

        {/* Login Form Area */}
        <motion.div
          initial={false}
          animate={{ 
            left: isMobile ? '0%' : '60%',
            width: isMobile ? '100%' : '40%',
            opacity: mode === 'login' ? 1 : 0,
            pointerEvents: mode === 'login' ? 'auto' : 'none',
            zIndex: mode === 'login' ? 30 : 10
          }}
          transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-y-0 flex flex-col items-center justify-center p-6 md:p-12"
        >
          <LoginForm onToggleMode={toggleMode} />
        </motion.div>

        {/* Register Form Area */}
        <motion.div
          initial={false}
          animate={{ 
            left: '0%',
            width: isMobile ? '100%' : '40%',
            opacity: mode === 'register' ? 1 : 0,
            pointerEvents: mode === 'register' ? 'auto' : 'none',
            zIndex: mode === 'register' ? 30 : 10
          }}
          transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-y-0 flex flex-col items-center justify-center p-6 md:p-12"
        >
          <RegisterForm onToggleMode={toggleMode} />
        </motion.div>
      </motion.main>
    </div>
  );
};
