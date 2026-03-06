import React, { useState } from 'react';
import { useUIStore } from '@/store/ui.store';
import { ModalBase } from '@/shared/ui/ModalBase';
import { useDebtPlansStore } from '@/store/debtPlans.store';
import { useMonthlyRecordsStore } from '@/store/monthlyRecords.store';
import { DebtPlan } from '@/models/debtPlan.model';
import { calculateProgressPercent } from '@/helpers/debtPlan.calculations';
import { 
  getIncomeRecords, 
  getTotalReceivedInMonth, 
  getIncomeMonthComparison, 
  getProjectedNextMonthIncome,
  getTotalIncomeInMonth,
  getTotalActiveExpensesInMonth,
  getExpenseCategoryChartData,
  getIncomeExpenseTrendChartData,
  getCashFlowChartData
} from '@/helpers/monthlyRecords.calculations';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Globe, Landmark, Building2, TrendingUp, LayoutGrid, CheckCircle2, XCircle, Edit2, Plus } from 'lucide-react';
import { RowActionsMenu, ActionItem } from '@/shared/ui/RowActionsMenu';
import { Tooltip } from '@/shared/ui/Tooltip';

import { useInvestmentsStore } from '@/store/investments.store';

const priorityWeight = {
  'Alta': 3,
  'Média': 2,
  'Baixa': 1
};

const sortPlansForDashboard = (plans: DebtPlan[]) => {
  return [...plans].sort((a, b) => {
    const aProgress = calculateProgressPercent(a);
    const bProgress = calculateProgressPercent(b);
    const aConcluded = aProgress === 100;
    const bConcluded = bProgress === 100;

    if (aConcluded !== bConcluded) {
      return aConcluded ? 1 : -1;
    }

    return priorityWeight[b.prioridade] - priorityWeight[a.prioridade];
  });
};

export const ModalExpandedCard = () => {
  const { 
    expandedModal, 
    closeExpandedModal, 
    openPlanDrawer, 
    openInvestmentContributionModal,
    openRegisterModal
  } = useUIStore();
  const { items: plans } = useDebtPlansStore();
  const { 
    items: records, 
    allRecords,
    selectedMonth, 
    markAsReceived, 
    markAsPaid, 
    cancelRecord,
    setSelectedRecord
  } = useMonthlyRecordsStore();
  const { investments } = useInvestmentsStore();

  const [summaryFilter, setSummaryFilter] = useState<'Todos' | 'Pago' | 'Pendente'>('Todos');

  if (!expandedModal) return null;

  const { type } = expandedModal;

  const iconMap = {
    Globe,
    Landmark,
    Building2,
  };

  const getRecordActions = (record: any): ActionItem[] => {
    const actions: ActionItem[] = [
      { 
        label: 'Editar', 
        onClick: () => {
          setSelectedRecord(record);
          openRegisterModal();
        }, 
        icon: <Edit2 size={14} /> 
      }
    ];

    if (record.status === 'Pendente') {
      if (record.tipo === 'Receita') {
        actions.push({ 
          label: 'Marcar como Recebido', 
          onClick: () => markAsReceived(record.id), 
          icon: <CheckCircle2 size={14} className="text-green-500" /> 
        });
      } else {
        actions.push({ 
          label: 'Marcar como Pago', 
          onClick: () => markAsPaid(record.id), 
          icon: <CheckCircle2 size={14} className="text-green-500" /> 
        });
      }
    }

    if (record.status !== 'Cancelado') {
      actions.push({ 
        label: 'Cancelar', 
        onClick: () => cancelRecord(record.id), 
        icon: <XCircle size={14} className="text-red-500" />,
        variant: 'danger'
      });
    }

    return actions;
  };

  const renderInvestmentsContent = () => {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investments.map((inv) => {
            const Icon = iconMap[inv.icone as keyof typeof iconMap] || Globe;
            return (
              <div key={inv.id} className="p-6 rounded-2xl shadow-sm flex flex-col gap-4" style={{ backgroundColor: 'var(--modal-surface)', border: '1px solid var(--modal-border)' }}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${inv.cor} rounded-xl flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--modal-text)' }}>{inv.nome}</h4>
                    <p className="text-sm font-black" style={{ color: 'var(--modal-text)' }}>{formatCurrency(inv.valorAtual)}</p>
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
              {formatCurrency(investments.reduce((acc, inv) => acc + inv.valorAtual, 0))}
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
    const totalDivida = plans.reduce((acc, p) => acc + p.valorTotal, 0);
    const mediaPaga = plans.length > 0 ? plans.reduce((acc, p) => acc + calculateProgressPercent(p), 0) / plans.length : 0;
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
            {sortedPlans.map((plan) => {
              const progress = calculateProgressPercent(plan);
              return (
                <div key={plan.id} className="p-6 rounded-2xl shadow-sm flex flex-col gap-4" style={{ backgroundColor: 'var(--modal-surface)', border: '1px solid var(--modal-border)' }}>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold" style={{ color: 'var(--modal-text)' }}>{plan.nome}</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                          plan.prioridade === 'Alta' ? "bg-red-100 text-red-600" :
                          plan.prioridade === 'Média' ? "bg-orange-100 text-orange-600" :
                          "bg-blue-100 text-blue-600"
                        )}>
                          {plan.prioridade}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--modal-muted)' }}>Valor Total: {formatCurrency(plan.valorTotal)}</p>
                    </div>
                    <Button variant="primary" size="md" onClick={() => {
                      openPlanDrawer(plan.id, 'modal');
                    }}>
                      Detalhes do plano
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 flex rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full" style={{ backgroundColor: 'var(--modal-accent)', width: `${progress}%` }}></div>
                      <div className="h-full" style={{ backgroundColor: 'var(--modal-danger)', width: `${100 - progress}%` }}></div>
                    </div>
                    <span className="text-sm font-black" style={{ color: 'var(--modal-text)' }}>{progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderIncomeContent = () => {
    const incomeRecords = getIncomeRecords(records);
    const totalReceived = getTotalReceivedInMonth(records);
    const comparison = getIncomeMonthComparison(totalReceived, 4620);
    const projection = getProjectedNextMonthIncome(records);

    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between p-8 rounded-2xl text-white" style={{ backgroundColor: 'var(--modal-accent)', color: '#000' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ opacity: 0.7 }}>Total Recebido ({selectedMonth})</p>
            <p className="text-5xl font-black">{formatCurrency(totalReceived)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <TrendingUp size={16} />
              <span className="text-xs font-bold">{comparison >= 0 ? '+' : ''}{comparison.toFixed(1)}%</span>
            </div>
            <p className="text-[10px] uppercase font-bold" style={{ opacity: 0.6 }}>vs mês anterior</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-tight" style={{ color: 'var(--modal-muted)' }}>Histórico de Entradas</h4>
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {incomeRecords.map((income) => (
                <div key={income.id} className="flex justify-between items-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--modal-text)' }}>{income.descricao}</p>
                    <p className="text-[10px]" style={{ color: 'var(--modal-muted)' }}>{formatDate(income.data)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: 'var(--modal-accent)' }}>{formatCurrency(income.valor)}</p>
                      <p className={cn(
                        "text-[9px] font-bold uppercase",
                        income.status === 'Recebido' ? 'text-green-400' : 'text-orange-400'
                      )}>
                        {income.status}
                      </p>
                    </div>
                    <RowActionsMenu actions={getRecordActions(income)} />
                  </div>
                </div>
              ))}
              {incomeRecords.length === 0 && (
                <p className="text-center py-8 text-sm text-slate-500">Nenhuma entrada registrada.</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-tight" style={{ color: 'var(--modal-muted)' }}>Projeção Próximo Mês</h4>
            <div className="p-6 rounded-2xl flex flex-col gap-6" style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--modal-muted)' }}>Estimativa de Recebimento</p>
                <p className="text-3xl font-black">{formatCurrency(projection)}</p>
              </div>
              <div className="flex flex-col gap-3">
                {incomeRecords.slice(0, 3).map(rec => (
                  <div key={rec.id} className="flex justify-between text-xs">
                    <span style={{ color: 'var(--modal-muted)' }}>{rec.descricao}</span>
                    <span className="font-bold">{formatCurrency(rec.valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthlySummaryContent = () => {
    const filteredRecords = records.filter(t => {
      if (summaryFilter === 'Todos') return t.status !== 'Cancelado';
      return t.status === summaryFilter;
    });

    const {
      totalIncome,
      totalExpense,
      incomePercent,
      expensePercent,
      saldo
    } = getCashFlowChartData(records);

    const categoryData = getExpenseCategoryChartData(records);
    const trendData = getIncomeExpenseTrendChartData(allRecords, selectedMonth);

    const generatePath = (data: any[], key: string, height: number, width: number) => {
      if (data.length === 0) return "";
      const allValues = data.flatMap(d => [d.income, d.expense]);
      const maxVal = Math.max(...allValues, 1);
      const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d[key] / maxVal) * (height - 20) - 10;
        return `${x},${y}`;
      });
      return `M${points.join(" L")}`;
    };

    const incomePath = generatePath(trendData, 'income', 120, 400);
    const expensePath = generatePath(trendData, 'expense', 120, 400);

    const exportToCSV = () => {
      const headers = ['Tipo', 'Data', 'Descrição/Origem', 'Categoria', 'Valor', 'Situação'];
      const rows = records.map(t => [
        t.tipo,
        formatDate(t.data),
        t.descricao,
        t.tipo === 'Receita' ? 'Receita' : (t.categoria || t.origem || '-'),
        formatCurrency(t.valor).replace('€', '').trim(),
        t.status
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `resumo_mensal_${selectedMonth.replace('/', '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="flex flex-col gap-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
          {/* Rendimentos vs Despesas */}
          <div className="p-6 rounded-2xl shadow-sm flex flex-col items-center gap-4 border" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--modal-muted)' }}>Fluxo de Caixa</h4>
            <div className="relative w-[160px] h-[160px] flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="rgba(255,255,255,0.05)" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="var(--modal-accent)" strokeDasharray={`${incomePercent}, 100`} strokeLinecap="round" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="var(--modal-danger)" strokeDasharray={`${expensePercent}, 100`} strokeDashoffset={`-${incomePercent}`} strokeLinecap="round" strokeWidth="4"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Saldo</span>
                <span className="text-xl font-black" style={{ color: 'var(--modal-text)' }}>{formatCurrency(saldo)}</span>
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
                {categoryData.slice(0, 3).map((cat, i, arr) => {
                  const totalVal = categoryData.reduce((acc, c) => acc + c.value, 0);
                  const percent = (cat.value / totalVal) * 100;
                  const offset = arr.slice(0, i).reduce((acc, c) => acc + (c.value / totalVal) * 100, 0);
                  const colors = ['#3b82f6', '#f59e0b', '#8b5cf6'];
                  return (
                    <circle 
                      key={cat.name}
                      cx="18" cy="18" fill="transparent" r="16" 
                      stroke={colors[i % colors.length]} 
                      strokeDasharray={`${percent}, 100`} 
                      strokeDashoffset={`-${offset}`}
                      strokeLinecap="round" strokeWidth="4"
                    ></circle>
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <LayoutGrid size={24} style={{ color: 'var(--modal-muted)' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
              {categoryData.slice(0, 4).map((cat, i) => {
                const colors = ['bg-[#3b82f6]', 'bg-[#f59e0b]', 'bg-[#8b5cf6]', 'bg-slate-700'];
                return (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`}></div>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--modal-muted)' }}>{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tendência */}
          <div className="p-6 rounded-2xl shadow-sm flex flex-col gap-6 border" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--modal-muted)' }}>Tendência (6 Meses)</h4>
            <div className="flex-1 flex flex-col gap-2 h-[120px]">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 120">
                <path d={incomePath} fill="none" stroke="var(--modal-accent)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                <path d={expensePath} fill="none" stroke="var(--modal-danger)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                
                {trendData.map((d, i) => {
                  const x = (i / (trendData.length - 1)) * 400;
                  const allValues = trendData.flatMap(v => [v.income, v.expense]);
                  const maxVal = Math.max(...allValues, 1);
                  const yIncome = 120 - (d.income / maxVal) * 100 - 10;
                  const yExpense = 120 - (d.expense / maxVal) * 100 - 10;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={yIncome} fill="white" r="3" stroke="var(--modal-accent)" strokeWidth="2"></circle>
                      <circle cx={x} cy={yExpense} fill="white" r="3" stroke="var(--modal-danger)" strokeWidth="2"></circle>
                    </g>
                  );
                })}
              </svg>
              <div className="flex justify-between w-full px-1">
                {trendData.map((d, i) => (
                  <span key={i} className="text-[8px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>{d.month}</span>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--modal-muted)' }}>
                Seu patrimônio cresceu <span style={{ color: 'var(--modal-accent)', fontWeight: 'bold' }}>18%</span> nos últimos 3 meses.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-sm font-semibold uppercase tracking-tight" style={{ color: 'var(--modal-muted)' }}>Todas as Transações</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[var(--modal-surface)] border border-[var(--modal-border)] rounded-lg p-1">
                {(['Todos', 'Pago', 'Pendente'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setSummaryFilter(f)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all",
                      summaryFilter === f 
                        ? "bg-[var(--modal-accent)] text-black" 
                        : "text-[var(--modal-muted)] hover:text-[var(--modal-text)]"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={exportToCSV}>Exportar CSV</Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border flex flex-col flex-1 min-h-0" style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}>
            <div className="overflow-y-auto scrollbar-hide">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10" style={{ backgroundColor: 'var(--modal-surface)' }}>
                  <tr className="text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: 'var(--modal-muted)', borderColor: 'var(--modal-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Situação</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--modal-border)' }}>
                  {filteredRecords.map((t) => (
                    <tr key={t.id} className="transition-colors" style={{ backgroundColor: 'transparent' }}>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--modal-text)' }}>{formatDate(t.data)}</td>
                      <td className="px-6 py-4 text-sm font-semibold" style={{ color: 'var(--modal-text)' }}>{t.descricao}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--modal-text)' }}>
                          {t.tipo === 'Receita' ? 'Receita' : (t.categoria || t.origem || 'Geral')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: 'var(--modal-text)' }}>{formatCurrency(t.valor)}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-bold uppercase",
                          t.status === 'Pago' || t.status === 'Recebido' ? 'text-green-400' : 
                          t.status === 'Cancelado' ? 'text-slate-500' : 'text-orange-400'
                        )}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <RowActionsMenu actions={getRecordActions(t)} />
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                        Nenhum registro encontrado para este filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Floating Action Button for new record */}
        <div className="absolute bottom-6 right-6 pointer-events-none z-20">
          <div className="pointer-events-auto">
            <Tooltip content="Registrar movimentação" className="right-0 left-auto translate-x-0">
              <button 
                onClick={() => openRegisterModal('monthlySummary')}
                className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
              >
                <Plus size={28} />
              </button>
            </Tooltip>
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
