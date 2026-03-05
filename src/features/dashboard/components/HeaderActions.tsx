import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { 
  SlidersHorizontal, 
  CalendarDays, 
  ChevronDown, 
  Plus 
} from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/useClickOutside';

export const HeaderActions = () => {
  const openRegisterModal = useUIStore(s => s.openRegisterModal);
  const { dashboardFilters, setDashboardFilters } = useUIStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  useClickOutside(filterRef, () => setIsFilterOpen(false));
  useClickOutside(periodRef, () => setIsPeriodOpen(false));

  const periods = ['Este Mês', 'Mês Passado', 'Últimos 3 Meses'];

  const toggleType = (type: 'income' | 'expense') => {
    const newTypes = dashboardFilters.types.includes(type)
      ? dashboardFilters.types.filter(t => t !== type)
      : [...dashboardFilters.types, type];
    setDashboardFilters({ types: newTypes });
  };

  return (
    <header className="w-full bg-background-light shrink-0 z-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-8 pb-6">
        <div className="flex flex-col gap-1 mb-8 hidden sm:flex">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm">Controle financeiro em tempo real</p>
        </div>
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-row gap-2 sm:gap-4 relative">
            {/* Filters Button */}
            <div className="relative" ref={filterRef}>
              <Button 
                variant="outline" 
                size="md"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn("h-10 px-3 sm:px-4", isFilterOpen ? 'bg-slate-50' : '')}
                aria-label="Filtros"
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline ml-2">Filtros</span>
              </Button>
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50"
                  >
                    <div className="flex flex-col gap-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Tipo</p>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary" 
                          checked={dashboardFilters.types.includes('expense')}
                          onChange={() => toggleType('expense')}
                        /> Despesa
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary" 
                          checked={dashboardFilters.types.includes('income')}
                          onChange={() => toggleType('income')}
                        /> Renda
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Period Selector */}
            <div className="relative" ref={periodRef}>
              <Button 
                variant="outline"
                size="md"
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                className={cn("h-10 px-3 sm:px-4", isPeriodOpen ? 'bg-slate-50' : '')}
                aria-label={dashboardFilters.period}
              >
                <CalendarDays size={18} className="text-primary" />
                <span className="hidden sm:inline ml-2">{dashboardFilters.period}</span>
                <ChevronDown size={18} className="ml-1 sm:ml-2" />
              </Button>
              <AnimatePresence>
                {isPeriodOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  >
                    {periods.map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setDashboardFilters({ period });
                          setIsPeriodOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors",
                          dashboardFilters.period === period ? "bg-slate-50 font-bold" : ""
                        )}
                      >
                        {period}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" size="md" className="h-10 px-3 sm:px-8" onClick={openRegisterModal} aria-label="Registrar">
              <Plus size={20} strokeWidth={3} />
              <span className="hidden sm:inline ml-2">Registrar</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
