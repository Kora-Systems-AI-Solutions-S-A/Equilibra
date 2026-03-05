import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';

export const IncomeCard = () => {
  const { openExpandedModal } = useUIStore();

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[288px]">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-slate-900 text-lg font-semibold">Entradas de Renda</h3>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-slate-400 text-lg font-medium">€</span>
            <span className="text-4xl md:text-5xl font-black text-primary">5.200,00</span>
          </div>
          <p className="text-xs text-primary font-medium mt-3 tracking-wide uppercase">RECEBIDO ESTE MÊS</p>
        </div>
        <button 
          onClick={() => openExpandedModal('income')}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowUpRight size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-auto pt-4">
        <div className="flex gap-2 items-center text-xs text-slate-400">
          <TrendingUp size={14} className="text-primary" />
          <span>+12.5% em relação ao mês anterior</span>
        </div>
        <div className="w-full bg-slate-50 p-3 rounded-lg flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Próximo Recebimento</span>
          <span className="text-xs font-bold text-slate-600">25 Out • € 1.200,00</span>
        </div>
      </div>
    </div>
  );
};
