import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface DrawerBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const DrawerBase = ({ isOpen, onClose, title, children }: DrawerBaseProps) => {
  // Lock scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-theme" key="drawer-wrapper" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-sm z-[110]"
            style={{ backgroundColor: 'var(--modal-overlay)' }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md shadow-2xl z-[111] overflow-hidden flex flex-col"
            style={{ backgroundColor: 'var(--modal-bg)', color: 'var(--modal-text)' }}
          >
            <div
              className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: 'var(--modal-border)' }}
            >
              <h3 className="text-lg font-semibold" style={{ color: 'var(--modal-text)' }}>{title}</h3>
              <button
                onClick={onClose}
                className="transition-colors hover:opacity-70"
                style={{ color: 'var(--modal-muted)' }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
