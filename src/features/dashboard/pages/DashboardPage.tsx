import { HeaderActions } from '@/features/dashboard/components/HeaderActions';
import { DebtPlanningCard } from '@/features/dashboard/components/DebtPlanningCard';
import { IncomeCard } from '@/features/dashboard/components/IncomeCard';
import { MonthlySummaryCard } from '@/features/dashboard/components/MonthlySummaryCard';
import { InvestmentsCard } from '@/features/dashboard/components/InvestmentsCard';
import { useInvestmentsStore } from '@/store/investments.store';
import { useDebtPlansStore } from '@/store/debtPlans.store';
import { useUIStore } from '@/store/ui.store';
import { useEffect } from 'react';

export const DashboardPage = () => {
  const { investments } = useInvestmentsStore();
  const { fetchDebtPlans } = useDebtPlansStore();
  const { openExpandedModal, openInvestmentContributionModal, openCreateInvestmentModal } = useUIStore();

  useEffect(() => {
    fetchDebtPlans();
  }, [fetchDebtPlans]);

  const handleExpandInvestment = () => openExpandedModal('investments');
  const handleReinforceInvestment = (id: string) => openInvestmentContributionModal(id);
  const handleCreateInvestment = () => openCreateInvestmentModal();

  return (
    <div className="w-full">
      <HeaderActions />
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            <DebtPlanningCard />
            <IncomeCard />
          </div>
          <MonthlySummaryCard />
          
          <InvestmentsCard 
            investments={investments}
            onExpandInvestment={handleExpandInvestment}
            onReinforceInvestment={handleReinforceInvestment}
            onCreateNewInvestment={handleCreateInvestment}
          />
        </div>
      </div>
    </div>
  );
};
