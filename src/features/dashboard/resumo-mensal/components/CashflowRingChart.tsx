import { formatK } from '@/lib/utils';

interface CashflowRingChartProps {
    saldo: number;
    incomePercent: number;
    expensePercent: number;
}

export const CashflowRingChart = ({ saldo, incomePercent, expensePercent }: CashflowRingChartProps) => {
    return (
        <div className="flex items-center gap-4">
            <div className="relative w-[100px] h-[100px] shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="transparent" r="16" stroke="var(--color-graphite-border)" strokeWidth="3.5"></circle>
                    <circle cx="18" cy="18" fill="transparent" r="16" stroke="var(--color-success)" strokeDasharray={`${incomePercent}, 100`} strokeLinecap="round" strokeWidth="3.5"></circle>
                    <circle cx="18" cy="18" fill="transparent" r="16" stroke="var(--color-danger)" strokeDasharray={`${expensePercent}, 100`} strokeDashoffset={`-${incomePercent}`} strokeLinecap="round" strokeWidth="3.5"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Saldo</span>
                    <span className="text-[11px] font-black">{formatK(saldo)}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rendimentos vs Despesas</h4>
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-[11px] font-medium text-slate-600">Rendimentos ({incomePercent.toFixed(0)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-danger"></div>
                        <span className="text-[11px] font-medium text-slate-600">Despesas ({expensePercent.toFixed(0)}%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
