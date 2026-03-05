import { HeaderActions } from '@/features/dashboard/components/HeaderActions';
import { DebtPlanningCard } from '@/features/dashboard/components/DebtPlanningCard';
import { IncomeCard } from '@/features/dashboard/components/IncomeCard';
import { MonthlySummaryCard } from '@/features/dashboard/components/MonthlySummaryCard';
import { InvestmentsCard } from '@/features/dashboard/components/InvestmentsCard';
import { useInvestmentsStore } from '@/store/investments.store';
import { useUIStore } from '@/store/ui.store';

export const DashboardPage = () => {
  const { investments } = useInvestmentsStore();
  const { openExpandedModal, openInvestmentContributionModal, openCreateInvestmentModal } = useUIStore();

  const handleExpandInvestment = () => openExpandedModal('investments');
  const handleReinforceInvestment = (id: string) => openInvestmentContributionModal(id);
  const handleCreateInvestment = () => openCreateInvestmentModal();

  return (
    <div className="w-full">
      <HeaderActions />
      <div className="w-full">
        <div className="max-w-[clamp(1024px,92vw,1680px)] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6 2xl:gap-8">
            <DebtPlanningCard />
            <IncomeCard />
            
            <div className="2xl:row-span-2">
              <InvestmentsCard 
                investments={investments}
                onExpandInvestment={handleExpandInvestment}
                onReinforceInvestment={handleReinforceInvestment}
                onCreateNewInvestment={handleCreateInvestment}
              />
            </div>

            <div className="2xl:col-span-2">
              <MonthlySummaryCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
