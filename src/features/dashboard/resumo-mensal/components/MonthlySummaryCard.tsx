import { useMonthlyRecordsStore } from '@/store/monthlyRecords.store';
import {
  getExpenseCategoryChartData,
  getIncomeExpenseTrendChartData,
  getCashFlowChartData,
  filterRecordsByDashboardFilters
} from '@/helpers/monthlyRecords.calculations';
import { ArrowUpRight, CheckCircle2, XCircle, Edit2 } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { ActionItem } from '@/shared/ui/RowActionsMenu';
import { MonthlyRecord } from '@/models/monthlyRecord.model';

// Sub-components
import { CashflowRingChart } from './CashflowRingChart';
import { CategoryDonutChart } from './CategoryDonutChart';
import { FinancialTrendGraph } from './FinancialTrendGraph';
import { TransactionsTableView } from './TransactionsTableView';

export const MonthlySummaryCard = () => {
  const {
    allRecords,
    selectedMonth,
    markAsPaid,
    markAsReceived,
    cancelRecord,
    setSelectedRecord
  } = useMonthlyRecordsStore();
  const { openExpandedModal, dashboardFilters, openRegisterModal } = useUIStore();

  const filteredRecords = filterRecordsByDashboardFilters(allRecords, dashboardFilters, selectedMonth);

  const {
    saldo,
    incomePercent,
    expensePercent
  } = getCashFlowChartData(filteredRecords);

  const categoryData = getExpenseCategoryChartData(filteredRecords);
  const trendData = getIncomeExpenseTrendChartData(allRecords, selectedMonth);
  const displayedRecords = filteredRecords.slice(0, 2);

  const getRecordActions = (record: MonthlyRecord): ActionItem[] => {
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
          icon: <CheckCircle2 size={14} className="text-success" />
        });
      } else {
        actions.push({
          label: 'Marcar como Pago',
          onClick: () => markAsPaid(record.id),
          icon: <CheckCircle2 size={14} className="text-success" />
        });
      }
    }

    if (record.status !== 'Cancelado') {
      actions.push({
        label: 'Cancelar',
        onClick: () => cancelRecord(record.id),
        icon: <XCircle size={14} className="text-danger" />,
        variant: 'danger'
      });
    }

    return actions;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      <div className="p-6 md:p-8 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">Resumo do Mês</h2>
          <p className="text-sm text-slate-500">Visão consolidada do seu fluxo financeiro.</p>
        </div>
        <button
          onClick={() => openExpandedModal('monthlySummary')}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowUpRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-8 py-8 bg-slate-50/30 border-b border-slate-100/50 min-h-[180px] items-center">
        <CashflowRingChart saldo={saldo} incomePercent={incomePercent} expensePercent={expensePercent} />
        <CategoryDonutChart categoryData={categoryData} />
        <FinancialTrendGraph trendData={trendData} />
      </div>

      <TransactionsTableView records={displayedRecords} getRecordActions={getRecordActions} />
    </div>
  );
};
