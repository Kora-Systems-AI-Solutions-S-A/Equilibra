import { cn } from '@/lib/utils';
import { useDebtPlansStore } from '@/store/debtPlans.store';
import { DebtPlan } from '@/models/debtPlan.model';
import { calculateProgressPercent, sortPlansForDashboard } from '@/helpers/debtPlan.calculations';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/shared/ui/Button';
import { ArrowUpRight, Plus } from 'lucide-react';

import { Tooltip } from '@/shared/ui/Tooltip';

export const DebtPlanningCard = () => {
  const { items: plans } = useDebtPlansStore();
  const { openAddPlanModal, openPlanDrawer, openExpandedModal } = useUIStore();

  const sortedPlans = sortPlansForDashboard(plans);

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 pb-20 md:pb-20 shadow-sm border border-slate-100 relative flex flex-col min-h-[288px]">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-slate-900 text-lg font-semibold">Planejamento de Dívidas</h3>
        <button
          onClick={() => openExpandedModal('debts')}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowUpRight size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 max-h-[160px] scrollbar-hide">
        {sortedPlans.length > 0 ? (
          <div className="flex flex-col gap-6">
            {sortedPlans.slice(0, 2).map((plan) => {
              const progress = calculateProgressPercent(plan);
              return (
                <div key={plan.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-slate-800">{plan.nome}</p>
                      <span className={cn(
                        "text-[9px] font-bold uppercase w-fit",
                        plan.prioridade === 'Alta' ? "text-danger" :
                          plan.prioridade === 'Média' ? "text-warning" :
                            "text-info"
                      )}>
                        {plan.prioridade}
                      </span>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => openPlanDrawer(plan.id, 'dashboard')}>
                      Ver plano
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 flex rounded-full overflow-hidden bg-slate-100">
                      <div className="h-full bg-success" style={{ width: `${progress}%` }}></div>
                      <div className="h-full bg-danger" style={{ width: `${100 - progress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
            <p className="text-sm font-medium text-slate-400">Nenhum plano ativo.</p>
            <p className="text-[11px] text-slate-400 mt-1">Clique no botão + para começar seu plano de quitação.</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-5 right-4">
        <Tooltip content="Criar plano de quitação">
          <button
            onClick={openAddPlanModal}
            className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <Plus size={24} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
