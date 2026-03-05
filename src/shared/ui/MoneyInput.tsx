/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({ 
  value, 
  onChange, 
  label, 
  error, 
  className,
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState('');

  // Formata o valor numérico para exibição (ex: 1234.56 -> "1.234,56")
  const formatForDisplay = (val: number) => {
    return new Intl.NumberFormat('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  useEffect(() => {
    // Atualiza o valor de exibição quando o valor externo muda, 
    // mas apenas se não estivermos editando ativamente ou se o valor for diferente
    const formatted = formatForDisplay(value);
    if (parseToNumber(displayValue) !== value) {
      setDisplayValue(formatted);
    }
  }, [value]);

  const parseToNumber = (str: string): number => {
    if (!str) return 0;
    // Remove tudo que não é dígito
    const cleanStr = str.replace(/\D/g, '');
    return Number(cleanStr) / 100;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseToNumber(rawValue);
    
    // Atualiza o estado local com a formatação
    setDisplayValue(formatForDisplay(numericValue));
    
    // Notifica o componente pai com o número real
    onChange(numericValue);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
          €
        </span>
        <input
          {...props}
          type="text"
          value={displayValue}
          onChange={handleChange}
          className={cn(
            "w-full rounded-lg p-2 pl-8 outline-none transition-all",
            "bg-[var(--modal-surface)] text-[var(--modal-text)] border border-[var(--modal-border)]",
            "focus:border-[var(--modal-accent)]",
            error && "border-red-500",
            className
          )}
        />
      </div>
      {error && <span className="text-[10px] text-red-500 font-bold uppercase">{error}</span>}
    </div>
  );
};
