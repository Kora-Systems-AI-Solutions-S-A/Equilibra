import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-[#111111] font-bold shadow-[0_12px_24px_rgba(74,222,128,0.2)] hover:bg-primary-hover hover:shadow-[0_16px_32px_rgba(74,222,128,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-in-out',
      secondary: 'bg-white/[0.04] text-white border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-in-out shadow-inner',
      outline: 'bg-transparent border border-[var(--button-outline-border)] text-[var(--button-outline-text)] font-semibold hover:bg-[var(--button-outline-hover)] active:scale-[0.98] transition-all duration-300',
      ghost: 'p-3 text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300 rounded-xl',
      icon: 'w-11 h-11 bg-white/[0.04] text-slate-400 rounded-full border border-white/[0.08] flex items-center justify-center shadow-sm relative hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-[10px] uppercase h-8',
      md: 'px-5 py-2.5 text-sm h-10',
      lg: 'px-8 py-3.5 text-base h-12',
      icon: 'p-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl transition-all tracking-tight',
          variants[variant],
          size !== 'icon' && sizes[size as keyof typeof sizes],
          variant === 'icon' && 'rounded-full',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
