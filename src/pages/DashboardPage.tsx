import { HeaderActions } from '@/features/dashboard/components/HeaderActions';
import { DebtPlanningCard } from '@/features/dashboard/planejamento-dividas';
import { IncomeCard, MonthlySummaryCard } from '@/features/dashboard/resumo-mensal';
import { InvestmentsCard } from '@/features/dashboard/investimentos';
import { useInvestmentsStore } from '@/store/investments.store';
import { useDebtPlansStore } from '@/store/debtPlans.store';
import { useMonthlyRecordsStore } from '@/store/monthlyRecords.store';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { useEffect } from 'react';

export const DashboardPage = () => {
  const { fetchInvestmentPlans } = useInvestmentsStore();
  const { fetchDebtPlans } = useDebtPlansStore();
  const { fetchAllRecords } = useMonthlyRecordsStore();
  const { dashboardFilters, setPageTransitionLoading } = useUIStore();
  const userId = useAuthStore(state => state.user?.id);

  useEffect(() => {
    if (!userId) return;

    Promise.all([
      fetchDebtPlans(),
      fetchAllRecords(),
      fetchInvestmentPlans()
    ]).finally(() => {
      setPageTransitionLoading(false);
    });
  }, [fetchDebtPlans, fetchAllRecords, fetchInvestmentPlans, setPageTransitionLoading, userId]);

  const showIncome = dashboardFilters.types.includes('income');
  const showExpense = dashboardFilters.types.includes('expense');

  return (
    <div className="w-full">
      <HeaderActions />
      <div className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 md:px-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            {showExpense && <DebtPlanningCard />}
            {showIncome && <IncomeCard />}
          </div>
          <MonthlySummaryCard />

          <InvestmentsCard />
        </div>
      </div>
    </div>
  );
};
