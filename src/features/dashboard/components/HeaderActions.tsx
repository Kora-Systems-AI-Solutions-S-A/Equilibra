import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { 
  SlidersHorizontal, 
  CalendarDays, 
  ChevronDown, 
  Plus 
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export const HeaderActions = () => {
  const openRegisterModal = useUIStore(s => s.openRegisterModal);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Este Mês');

  const periods = ['Este Mês', 'Mês Passado', 'Últimos 3 Meses'];

  return (
    <header className="w-full bg-background-light shrink-0 z-10">
      <div className="max-w-[1440px] mx-auto px-10 pt-6 pb-4">
        <div className="flex flex-col gap-0.5 mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm">Controle financeiro em tempo real</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 relative">
            {/* Filters Button */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="md"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn("h-10", isFilterOpen ? 'bg-slate-50' : '')}
              >
                <SlidersHorizontal size={18} />
                Filtros
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
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" /> Despesa
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" /> Renda
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Period Selector */}
            <div className="relative">
              <Button 
                variant="outline"
                size="md"
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                className={cn("h-10", isPeriodOpen ? 'bg-slate-50' : '')}
              >
                <CalendarDays size={18} className="text-primary" />
                {selectedPeriod}
                <ChevronDown size={18} className="ml-2" />
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
                          setSelectedPeriod(period);
                          setIsPeriodOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
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
            <Button variant="primary" size="md" className="h-10 px-8" onClick={openRegisterModal}>
              <Plus size={20} strokeWidth={3} />
              <span>Registrar</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
