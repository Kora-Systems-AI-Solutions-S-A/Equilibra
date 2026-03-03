import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-[#111111] font-bold shadow-md hover:bg-primary-hover active:bg-primary-active active:scale-[0.98] transition-all duration-200 ease-in-out',
      secondary: 'bg-slate-900 text-white dark:bg-primary dark:text-slate-900',
      outline: 'bg-[var(--modal-surface,white)] border-[var(--modal-border,theme(colors.slate.200))] text-[var(--modal-text,theme(colors.slate.900))] font-semibold shadow-sm hover:opacity-80',
      ghost: 'p-3 text-slate-400 hover:text-white transition-colors',
      icon: 'w-11 h-11 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm relative',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-[10px] uppercase',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-10 py-3.5 text-[17px]',
      icon: 'p-3',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full transition-all tracking-tight',
          variants[variant],
          size !== 'icon' && sizes[size as keyof typeof sizes],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
