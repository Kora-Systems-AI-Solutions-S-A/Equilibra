interface FinancialTrendGraphProps {
    trendData: { month: string; income: number; expense: number }[];
}

export const FinancialTrendGraph = ({ trendData }: FinancialTrendGraphProps) => {
    const generatePath = (data: any[], key: string, height: number, width: number) => {
        if (data.length === 0) return "";
        const allValues = data.flatMap(d => [d.income, d.expense]);
        const maxVal = Math.max(...allValues, 1);
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (d[key] / maxVal) * (height - 10) - 5; // padding
            return `${x},${y}`;
        });
        return `M${points.join(" L")}`;
    };

    const incomePath = generatePath(trendData, 'income', 60, 200);
    const expensePath = generatePath(trendData, 'expense', 60, 200);

    return (
        <div className="flex flex-col justify-center">
            <div className="flex flex-col gap-0.5 mb-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tendência Financeira</h4>
                <p className="text-[10px] text-slate-400">Últimos 6 meses</p>
            </div>
            <div className="w-full h-14 relative group">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 60">
                    <path d={incomePath} fill="none" stroke="var(--color-success)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d={expensePath} fill="none" stroke="var(--color-danger)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>

                    {trendData.map((d, i) => {
                        const x = (i / (trendData.length - 1)) * 200;
                        const allValues = trendData.flatMap(v => [v.income, v.expense]);
                        const maxVal = Math.max(...allValues, 1);
                        const yIncome = 60 - (d.income / maxVal) * 50 - 5;
                        const yExpense = 60 - (d.expense / maxVal) * 50 - 5;
                        return (
                            <g key={i}>
                                <circle cx={x} cy={yIncome} fill="white" r="2" stroke="var(--color-success)" strokeWidth="1"></circle>
                                <circle cx={x} cy={yExpense} fill="white" r="2" stroke="var(--color-danger)" strokeWidth="1"></circle>
                            </g>
                        );
                    })}
                </svg>
                <div className="flex justify-between mt-1 px-0.5">
                    {trendData.map((d, i) => (
                        <span key={i} className={`text-[8px] font-semibold uppercase tracking-tight ${i === trendData.length - 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                            {d.month}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
