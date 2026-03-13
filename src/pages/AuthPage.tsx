import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { AuthContainer } from '@/features/auth';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized, authStep, checkAuth } = useAuthStore();
  const { setPageTransitionLoading } = useUIStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated && authStep !== 'email-validated') {
        navigate('/home', { replace: true });
      } else {
        // We are on the auth page and not authenticated, so we can stop loading
        setPageTransitionLoading(false);
      }
    }
  }, [isAuthenticated, isInitialized, navigate, setPageTransitionLoading]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#060908]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="mt-6 text-sm font-medium text-slate-400 tracking-widest uppercase">
          Equilibrando sua sessão...
        </p>
      </div>
    );
  }

  return <AuthContainer />;
};
