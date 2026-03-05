import React from 'react';
import { useUIStore } from '@/store/ui.store';
import { ModalBase } from '@/components/ui/ModalBase';
import { useDebtPlansStore, DebtPlan } from '@/store/debtPlans.store';
import { useTransactionsStore } from '@/store/transactions.store';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Globe, Landmark, Building2, TrendingUp, LayoutGrid, MoreHorizontal } from 'lucide-react';

import { useInvestmentsStore } from '@/store/investments.store';

const priorityWeight = {
  'Alta': 3,
  'Média': 2,
  'Baixa': 1
};

const sortPlansForDashboard = (plans: DebtPlan[]) => {
  return [...plans].sort((a, b) => {
    const aConcluded = a.progressPercent === 100;
    const bConcluded = b.progressPercent === 100;

    if (aConcluded !== bConcluded) {
      return aConcluded ? 1 : -1;
    }

    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });
};

export const ModalExpandedCard = () => {
  const { expandedModal, closeExpandedModal, openPlanDrawer, openInvestmentContributionModal } = useUIStore();
  const plans = useDebtPlansStore(s => s.plans);
  const transactions = useTransactionsStore(s => s.transactions);
  const { investments } = useInvestmentsStore();

  if (!expandedModal) return null;

  const { type } = expandedModal;

  const iconMap = {
    Globe,
    Landmark,
    Building2,
  };

  const renderInvestmentsContent = () => {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investments.map((inv) => {
            const Icon = iconMap[inv.icon as keyof typeof iconMap];
            return (
              <div key={inv.id} className="p-6 rounded-2xl shadow-sm flex flex-col gap-4" style={{ backgroundColor: 'var(--modal-surface)', border: '1px solid var(--modal-border)' }}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${inv.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--modal-text)' }}>{inv.name}</h4>
                    <p className="text-sm font-black" style={{ color: 'var(--modal-text)' }}>{formatCurrency(inv.totalValue)}</p>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  size="md" 
                  className="w-full"
                  onClick={() => openInvestmentContributionModal(inv.id)}
                >
                  Reforçar
                </Button>
              </div>
            );
          })}
        </div>

        <div className="p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6" style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)' }}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--modal-muted)' }}>Patrimônio Total em Investimentos</p>
            <p className="text-4xl font-black">
              {formatCurrency(investments.reduce((acc, inv) => acc + inv.totalValue, 0))}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center p-4 rounded-xl min-w-[120px]" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Rendimento Mês</p>
              <p className="text-lg font-bold text-green-400">+€ 450,20</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl min-w-[120px]" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Dividendos</p>
              <p className="text-lg font-bold text-blue-400">€ 120,50</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDebtsContent = () => {
    const totalDivida = plans.reduce((acc, p) => acc + p.totalValue, 0);
    const mediaPaga = plans.length > 0 ? plans.reduce((acc, p) => acc + p.progressPercent, 0) / plans.length : 0;
    const sortedPlans = sortPlansForDashboard(plans);

    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--modal-muted)' }}>Total em Dívidas</p>
            <p className="text-3xl font-black" style={{ color: 'var(--modal-text)' }}>{formatCurrency(totalDivida)}</p>
          </div>
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'rgba(19, 236, 91, 0.1)', borderColor: 'rgba(19, 236, 91, 0.2)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--modal-accent)' }}>Média de Quitação</p>
            <p className="text-3xl font-black" style={{ color: 'var(--modal-accent)' }}>{mediaPaga.toFixed(1)}%</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-tight" style={{ color: 'var(--modal-muted)' }}>Todos os Planos Ativos</h4>
          <div className="grid grid-cols-1 gap-4">
            {sortedPlans.map((plan) => (
              <div key={plan.id} className="p-6 rounded-2xl shadow-sm flex flex-col gap-4" style={{ backgroundColor: 'var(--modal-surface)', border: '1px solid var(--modal-border)' }}>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold" style={{ color: 'var(--modal-text)' }}>{plan.name}</p>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                        plan.priority === 'Alta' ? "bg-red-100 text-red-600" :
                        plan.priority === 'Média' ? "bg-orange-100 text-orange-600" :
                        "bg-blue-100 text-blue-600"
                      )}>
                        {plan.priority}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--modal-muted)' }}>Valor Total: {formatCurrency(plan.totalValue)}</p>
                  </div>
                  <Button variant="primary" size="md" onClick={() => {
                    openPlanDrawer(plan.id, 'modal');
                  }}>
                    Detalhes do plano
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 flex rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full" style={{ backgroundColor: 'var(--modal-accent)', width: `${plan.progressPercent}%` }}></div>
                    <div className="h-full" style={{ backgroundColor: 'var(--modal-danger)', width: `${100 - plan.progressPercent}%` }}></div>
                  </div>
                  <span className="text-sm font-black" style={{ color: 'var(--modal-text)' }}>{plan.progressPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderIncomeContent = () => {
    const recentIncomes = [
      { id: 1, source: 'Salário Mensal', value: 4000, date: '05 Out', status: 'Recebido' },
      { id: 2, source: 'Freelance Design', value: 1200, date: '12 Out', status: 'Recebido' },
      { id: 3, source: 'Dividendos FIIs', value: 450, date: '15 Out', status: 'Pendente' },
      { id: 4, source: 'Venda de Ativos', value: 800, date: '20 Out', status: 'Pendente' },
    ];

    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between p-8 rounded-2xl text-white" style={{ backgroundColor: 'var(--modal-accent)', color: '#000' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ opacity: 0.7 }}>Total Recebido (Outubro)</p>
            <p className="text-5xl font-black">€ 5.200,00</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <TrendingUp size={16} />
              <span className="text-xs font-bold">+12.5%</span>
            </div>
            <p className="text-[10px] uppercase font-bold" style={{ opacity: 0.6 }}>vs mês anterior</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-tight" style={{ color: 'var(--modal-muted)' }}>Histórico de Entradas</h4>
            <div className="flex flex-col gap-3">
              {recentIncomes.map((income) => (
                <div key={income.id} className="flex justify-between items-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--modal-text)' }}>{income.source}</p>
                    <p className="text-[10px]" style={{ color: 'var(--modal-muted)' }}>{income.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: 'var(--modal-accent)' }}>{formatCurrency(income.value)}</p>
                    <p className={`text-[9px] font-bold uppercase ${income.status === 'Recebido' ? 'text-green-400' : 'text-orange-400'}`}>
                      {income.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-tight" style={{ color: 'var(--modal-muted)' }}>Projeção Próximo Mês</h4>
            <div className="p-6 rounded-2xl flex flex-col gap-6" style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--modal-muted)' }}>Estimativa de Recebimento</p>
                <p className="text-3xl font-black">€ 6.450,00</p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--modal-muted)' }}>Salário Fixo</span>
                  <span className="font-bold">€ 4.000,00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--modal-muted)' }}>Projetos Freelance</span>
                  <span className="font-bold">€ 2.000,00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--modal-muted)' }}>Rendimentos</span>
                  <span className="font-bold">€ 450,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthlySummaryContent = () => {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rendimentos vs Despesas */}
          <div className="p-6 rounded-2xl shadow-sm flex flex-col items-center gap-4 border" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--modal-muted)' }}>Fluxo de Caixa</h4>
            <div className="relative w-[160px] h-[160px] flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="rgba(255,255,255,0.05)" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="var(--modal-accent)" strokeDasharray="70, 100" strokeLinecap="round" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="var(--modal-danger)" strokeDasharray="30, 100" strokeDashoffset="-70" strokeLinecap="round" strokeWidth="4"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Saldo</span>
                <span className="text-xl font-black" style={{ color: 'var(--modal-text)' }}>€ 3.640</span>
              </div>
            </div>
            <div className="flex gap-4 w-full justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--modal-accent)' }}></div>
                <span className="text-[10px] font-bold" style={{ color: 'var(--modal-muted)' }}>Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--modal-danger)' }}></div>
                <span className="text-[10px] font-bold" style={{ color: 'var(--modal-muted)' }}>Saídas</span>
              </div>
            </div>
          </div>

          {/* Despesas por Categoria */}
          <div className="p-6 rounded-2xl shadow-sm flex flex-col items-center gap-4 border" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--modal-muted)' }}>Gastos por Categoria</h4>
            <div className="relative w-[160px] h-[160px] flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="rgba(255,255,255,0.05)" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#3b82f6" strokeDasharray="40, 100" strokeLinecap="round" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#f59e0b" strokeDasharray="25, 100" strokeDashoffset="-40" strokeLinecap="round" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#8b5cf6" strokeDasharray="35, 100" strokeDashoffset="-65" strokeLinecap="round" strokeWidth="4"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <LayoutGrid size={24} style={{ color: 'var(--modal-muted)' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                <span className="text-[10px] font-bold" style={{ color: 'var(--modal-muted)' }}>Habitação</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                <span className="text-[10px] font-bold" style={{ color: 'var(--modal-muted)' }}>Comida</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div>
                <span className="text-[10px] font-bold" style={{ color: 'var(--modal-muted)' }}>Lazer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                <span className="text-[10px] font-bold" style={{ color: 'var(--modal-muted)' }}>Outros</span>
              </div>
            </div>
          </div>

          {/* Tendência */}
          <div className="p-6 rounded-2xl shadow-sm flex flex-col gap-6 border" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--modal-muted)' }}>Tendência (6 Meses)</h4>
            <div className="flex-1 flex items-end gap-2 h-[120px]">
              {[40, 65, 45, 80, 55, 90].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{ height: `${h}%`, backgroundColor: i === 5 ? 'var(--modal-accent)' : 'rgba(255,255,255,0.05)' }}
                  ></div>
                  <span className="text-[8px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>{['M', 'J', 'J', 'A', 'S', 'O'][i]}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--modal-muted)' }}>
                Seu patrimônio cresceu <span style={{ color: 'var(--modal-accent)', fontWeight: 'bold' }}>18%</span> nos últimos 3 meses.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold uppercase tracking-tight" style={{ color: 'var(--modal-muted)' }}>Todas as Transações</h4>
            <Button variant="outline" size="sm">Exportar CSV</Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: 'var(--modal-muted)', borderColor: 'var(--modal-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--modal-border)' }}>
                {transactions.map((t) => (
                  <tr key={t.id} className="transition-colors" style={{ backgroundColor: 'transparent' }}>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--modal-text)' }}>{formatDate(t.date)}</td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: 'var(--modal-text)' }}>{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--modal-text)' }}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold" style={{ color: 'var(--modal-text)' }}>{formatCurrency(t.value)}</td>
                    <td className="px-6 py-4 text-right">
                      <button style={{ color: 'var(--modal-muted)' }} className="hover:opacity-80">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const getTitle = () => {
    switch (type) {
      case 'debts': return 'Planejamento de Dívidas';
      case 'income': return 'Entradas de Renda';
      case 'monthlySummary': return 'Resumo Detalhado do Mês';
      case 'investments': return 'Meus Investimentos';
      default: return '';
    }
  };

  return (
    <ModalBase
      isOpen={!!expandedModal}
      onClose={closeExpandedModal}
      title={getTitle()}
      maxWidth="max-w-6xl"
      zIndex={50}
    >
      {type === 'debts' && renderDebtsContent()}
      {type === 'income' && renderIncomeContent()}
      {type === 'monthlySummary' && renderMonthlySummaryContent()}
      {type === 'investments' && renderInvestmentsContent()}
    </ModalBase>
  );
};
