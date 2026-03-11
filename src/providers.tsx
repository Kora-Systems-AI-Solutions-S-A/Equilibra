import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAuthListener } from '@/hooks/useAuthListener';

const queryClient = new QueryClient();

// Componente interno para poder usar hooks dentro do contexto dos providers
function AuthListenerSetup() {
  useAuthListener();
  return null;
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthListenerSetup />
      {children}
    </QueryClientProvider>
  );
};

