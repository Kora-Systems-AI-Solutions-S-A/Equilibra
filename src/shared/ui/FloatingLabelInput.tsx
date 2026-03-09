import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ 
  label, 
  icon, 
  className, 
  value, 
  onFocus, 
  onBlur, 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = value !== undefined && value !== null && value !== '';

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className="relative group w-full">
      <div className={cn(
        "relative w-full h-14 sm:h-16 rounded-2xl border transition-all duration-300 ease-out flex items-center",
        isFocused 
          ? "bg-white/[0.08] border-primary/40 ring-4 ring-primary/10" 
          : "bg-white/[0.04] border-white/[0.08] group-hover:bg-white/[0.06] group-hover:border-white/[0.12]",
        props.disabled && "opacity-50 cursor-not-allowed",
        className
      )}>
        {icon && (
          <div className={cn(
            "flex-shrink-0 w-12 sm:w-14 flex items-center justify-center transition-colors duration-300",
            isFocused ? "text-primary" : "text-slate-500 group-hover:text-slate-400"
          )}>
            {icon}
          </div>
        )}
        
        <div className="relative flex-1 h-full">
          <input
            {...props}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=" " // Required for :placeholder-shown trick
            className={cn(
              "peer w-full h-full bg-transparent outline-none text-white text-sm transition-all",
              (isFocused || isFilled) ? "pt-5" : "pt-0",
              !icon && "pl-0"
            )}
          />
          
          <label 
            className={cn(
              "absolute left-0 transition-all duration-300 pointer-events-none select-none",
              "top-1/2 -translate-y-1/2 text-sm text-slate-500 group-hover:text-slate-400",
              "peer-focus:top-2.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary/80",
              "peer-autofill:top-2.5 peer-autofill:-translate-y-0 peer-autofill:text-[10px] peer-autofill:font-bold peer-autofill:uppercase peer-autofill:tracking-wider peer-autofill:text-primary/80",
              "peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:text-primary/80",
              // Fallback for React state if CSS fails or for initial render
              (isFocused || isFilled) && "top-2.5 -translate-y-0 text-[10px] font-bold uppercase tracking-wider text-primary/80"
            )}
          >
            {label}
          </label>
        </div>
      </div>
    </div>
  );
};
