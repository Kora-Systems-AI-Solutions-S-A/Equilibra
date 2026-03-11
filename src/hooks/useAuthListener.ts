import { useEffect } from 'react';
import { initializeAuthListener } from '@/store/auth.store';

// Hook responsável por inicializar e limpar o listener de autenticação do Supabase.
// Deve ser montado UMA ÚNICA VEZ na raiz da aplicação (dentro de Providers).
// O cleanup do useEffect garante que a subscrição seja cancelada ao desmontar,
// prevenindo memory leaks e múltiplas subscrições ativas.
export const useAuthListener = () => {
    useEffect(() => {
        const unsubscribe = initializeAuthListener();

        // Cancela a subscrição quando o componente desmonta
        return () => {
            unsubscribe();
        };
    }, []);
};
