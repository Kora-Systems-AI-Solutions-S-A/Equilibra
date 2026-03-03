import { useDebtPlansStore } from '@/store/debtPlans.store';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, Plus } from 'lucide-react';

export const DebtPlanningCard = () => {
  const plans = useDebtPlansStore(s => s.plans);
  const { openAddPlanModal, openPlanDrawer, openExpandedModal } = useUIStore();

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 relative flex flex-col min-h-[288px]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Planejamento de Dívidas</h3>
        <button 
          onClick={() => openExpandedModal('debts')}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowUpRight size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 max-h-[160px] scrollbar-hide">
        <div className="flex flex-col gap-6">
          {plans.slice(0, 2).map((plan) => (
            <div key={plan.id} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-800">{plan.name}</p>
                <Button variant="primary" size="sm" onClick={() => openPlanDrawer(plan.id, 'dashboard')}>
                  VER PLANO
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 flex rounded-full overflow-hidden bg-slate-100">
                  <div className="h-full bg-[#22C55E]" style={{ width: `${plan.paidPercentage}%` }}></div>
                  <div className="h-full bg-[#EF4444]" style={{ width: `${100 - plan.paidPercentage}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{plan.paidPercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={openAddPlanModal}
        className="absolute bottom-6 right-6 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <Plus size={20} />
      </button>
    </div>
  );
};
