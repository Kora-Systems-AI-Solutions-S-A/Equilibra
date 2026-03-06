import { HeaderActions } from '@/features/dashboard/shared/HeaderActions';
import { DebtPlanningCard } from '@/features/dashboard/planejamento-dividas/DebtPlanningCard';
import { IncomeCard } from '@/features/dashboard/resumo-mensal/IncomeCard';
import { MonthlySummaryCard } from '@/features/dashboard/resumo-mensal/MonthlySummaryCard';
import { InvestmentsCard } from '@/features/dashboard/investimentos/InvestmentsCard';
import { useInvestmentsStore } from '@/store/investments.store';
import { useDebtPlansStore } from '@/store/debtPlans.store';
import { useMonthlyRecordsStore } from '@/store/monthlyRecords.store';
import { useUIStore } from '@/store/ui.store';
import { useEffect } from 'react';

export const DashboardPage = () => {
    const { investments, fetchInvestmentPlans } = useInvestmentsStore();
    const { fetchDebtPlans } = useDebtPlansStore();
    const { fetchMonthlyRecords, fetchAllRecords } = useMonthlyRecordsStore();
    const { openExpandedModal, openInvestmentContributionModal, openCreateInvestmentModal } = useUIStore();

    useEffect(() => {
        fetchDebtPlans();
        fetchMonthlyRecords();
        fetchAllRecords();
        fetchInvestmentPlans();
    }, [fetchDebtPlans, fetchMonthlyRecords, fetchAllRecords, fetchInvestmentPlans]);

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
