import { useTransactionsStore } from '@/store/transactions.store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowUpRight, MoreHorizontal, LayoutGrid } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';

export const MonthlySummaryCard = () => {
  const transactions = useTransactionsStore(s => s.transactions);
  const { openExpandedModal } = useUIStore();

  const displayedTransactions = transactions.slice(0, 2);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      <div className="px-8 py-6 flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-bold text-slate-900">Resumo do Mês</h2>
          <p className="text-sm text-slate-500">Visão consolidada do seu fluxo financeiro.</p>
        </div>
        <button 
          onClick={() => openExpandedModal('monthlySummary')}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowUpRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-8 px-8 py-8 bg-slate-50/30 border-b border-slate-100/50 min-h-[180px] items-center">
        {/* Rendimentos vs Despesas */}
        <div className="flex items-center gap-4">
          <div className="relative w-[100px] h-[100px] shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#e2e8f0" strokeWidth="3.5"></circle>
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#22C55E" strokeDasharray="70, 100" strokeLinecap="round" strokeWidth="3.5"></circle>
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#EF4444" strokeDasharray="30, 100" strokeDashoffset="-70" strokeLinecap="round" strokeWidth="3.5"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[8px] font-bold text-slate-400 uppercase">Total</span>
              <span className="text-[11px] font-black">€ 8,2k</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rendimentos vs Despesas</h4>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                <span className="text-[11px] font-medium text-slate-600">Rendimentos (70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                <span className="text-[11px] font-medium text-slate-600">Despesas (30%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Despesas por Categoria */}
        <div className="flex items-center gap-4">
          <div className="relative w-[100px] h-[100px] shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#e2e8f0" strokeWidth="3.5"></circle>
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#3b82f6" strokeDasharray="40, 100" strokeLinecap="round" strokeWidth="3.5"></circle>
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#f59e0b" strokeDasharray="25, 100" strokeDashoffset="-40" strokeLinecap="round" strokeWidth="3.5"></circle>
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#8b5cf6" strokeDasharray="35, 100" strokeDashoffset="-65" strokeLinecap="round" strokeWidth="3.5"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <LayoutGrid size={16} className="text-slate-400" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Despesas por Categoria</h4>
            <div className="grid grid-cols-1 gap-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                <span className="text-[10px] font-medium text-slate-600">Habitação</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                <span className="text-[10px] font-medium text-slate-600">Alimentação</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div>
                <span className="text-[10px] font-medium text-slate-600">Lazer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tendência Financeira */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-col gap-0.5 mb-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tendência Financeira</h4>
            <p className="text-[10px] text-slate-400">Últimos 6 meses</p>
          </div>
          <div className="w-full h-14 relative group">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 60">
              <path d="M0,50 L33,42 L66,45 L100,25 L133,32 L166,15 L200,18" fill="none" stroke="var(--color-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <circle cx="0" cy="50" fill="white" r="2.5" stroke="var(--color-primary)" strokeWidth="1.5"></circle>
              <circle cx="33" cy="42" fill="white" r="2.5" stroke="var(--color-primary)" strokeWidth="1.5"></circle>
              <circle cx="66" cy="45" fill="white" r="2.5" stroke="var(--color-primary)" strokeWidth="1.5"></circle>
              <circle cx="100" cy="25" fill="white" r="2.5" stroke="var(--color-primary)" strokeWidth="1.5"></circle>
              <circle cx="133" cy="32" fill="white" r="2.5" stroke="var(--color-primary)" strokeWidth="1.5"></circle>
              <circle cx="166" cy="15" fill="white" r="2.5" stroke="var(--color-primary)" strokeWidth="1.5"></circle>
              <circle cx="200" cy="18" fill="white" r="2.5" stroke="var(--color-primary)" strokeWidth="1.5"></circle>
            </svg>
            <div className="flex justify-between mt-1 px-0.5">
              {['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'].map((m, i) => (
                <span key={m} className={`text-[8px] font-semibold uppercase tracking-tight ${i === 5 ? 'text-slate-900' : 'text-slate-400'}`}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
              <th className="px-8 py-3">Data</th>
              <th className="px-8 py-3">Descrição</th>
              <th className="px-8 py-3">Categoria</th>
              <th className="px-8 py-3">Valor</th>
              <th className="px-8 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displayedTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-4 text-sm font-medium">{formatDate(t.date)}</td>
                <td className="px-8 py-4 text-sm font-semibold">{t.description}</td>
                <td className="px-8 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
                    {t.category}
                  </span>
                </td>
                <td className="px-8 py-4 text-sm font-bold text-slate-900">{formatCurrency(t.value)}</td>
                <td className="px-8 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="py-4 px-6 bg-slate-50/50 text-center border-t border-slate-100/50">
        <a className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline" href="#">VER HISTÓRICO COMPLETO</a>
      </div>
    </div>
  );
};
