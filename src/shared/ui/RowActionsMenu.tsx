import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

interface RowActionsMenuProps {
  actions: ActionItem[];
  className?: string;
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({ actions, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Calculate position
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 4, // 4px gap
          left: rect.right - 160 // 160 is the width of the menu
        });
      }
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="fixed w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-[9999] py-1 overflow-hidden"
          style={{ 
            top: `${position.top}px`, 
            left: `${position.left}px` 
          }}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors",
                action.variant === 'danger' 
                  ? "text-red-600 hover:bg-red-50" 
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              {action.icon && <span className="shrink-0">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
