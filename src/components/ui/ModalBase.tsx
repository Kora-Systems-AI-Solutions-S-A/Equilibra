import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  zIndex?: number;
}

export const ModalBase = ({ isOpen, onClose, title, children, maxWidth = "max-w-md", className, zIndex = 100 }: ModalBaseProps) => {
  // Lock scroll when modal is open
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
        <div 
          className="fixed inset-0 flex items-center justify-center modal-theme"
          style={{ zIndex }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: 'var(--modal-overlay)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              "relative w-[90%] rounded-2xl shadow-2xl z-[1] overflow-hidden flex flex-col max-h-[85vh]",
              maxWidth,
              className
            )}
            style={{ backgroundColor: 'var(--modal-bg)', color: 'var(--modal-text)' }}
          >
            <div 
              className="p-6 border-b flex justify-between items-center shrink-0"
              style={{ borderColor: 'var(--modal-border)' }}
            >
              <h3 className="text-xl font-bold" style={{ color: 'var(--modal-text)' }}>{title}</h3>
              <button 
                onClick={onClose} 
                className="transition-colors"
                style={{ color: 'var(--modal-muted)' }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
