import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { useUIStore } from '@/store/ui.store';
import { LoadingOverlay } from '@/shared/ui/LoadingOverlay';
import { AnimatePresence, motion } from 'motion/react';
import { NotificationContainer } from '@/shared/ui/NotificationContainer';

function GlobalLoading() {
  const { isPageTransitionLoading, pageTransitionLabel } = useUIStore();
  
  return (
    <AnimatePresence>
      {isPageTransitionLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999]"
        >
          <LoadingOverlay visible={true} label={pageTransitionLabel} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <NotificationContainer />
      <GlobalLoading />
    </Providers>
  );
}
