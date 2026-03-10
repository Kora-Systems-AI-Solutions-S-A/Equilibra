import { formatK } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';

interface CategoryDonutChartProps {
    categoryData: { name: string; value: number }[];
}

export const CategoryDonutChart = ({ categoryData }: CategoryDonutChartProps) => {
    return (
        <div className="flex items-center gap-4">
            <div className="relative w-[100px] h-[100px] shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="transparent" r="16" stroke="var(--color-graphite-border)" strokeWidth="3.5"></circle>
                    {categoryData.length > 0 ? (
                        categoryData.slice(0, 3).map((cat, i, arr) => {
                            const totalVal = categoryData.reduce((acc, c) => acc + c.value, 0);
                            const percent = (cat.value / totalVal) * 100;
                            const offset = arr.slice(0, i).reduce((acc, c) => acc + (c.value / totalVal) * 100, 0);
                            const colors = ['var(--color-info)', 'var(--color-warning)', '#8b5cf6'];
                            return (
                                <circle
                                    key={cat.name}
                                    cx="18" cy="18" fill="transparent" r="16"
                                    stroke={colors[i % colors.length]}
                                    strokeDasharray={`${percent}, 100`}
                                    strokeDashoffset={`-${offset}`}
                                    strokeLinecap="round" strokeWidth="3.5"
                                ></circle>
                            );
                        })
                    ) : (
                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="var(--color-graphite-border)" strokeWidth="3.5"></circle>
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <LayoutGrid size={16} className="text-slate-400" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Despesas por Categoria</h4>
                <div className="grid grid-cols-1 gap-y-1">
                    {categoryData.slice(0, 3).map((cat, i) => {
                        const colors = ['bg-info', 'bg-warning', 'bg-[#8b5cf6]'];
                        return (
                            <div key={cat.name} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`}></div>
                                <span className="text-[10px] font-medium text-slate-600 truncate max-w-[100px]">{cat.name}</span>
                            </div>
                        );
                    })}
                    {categoryData.length === 0 && <span className="text-[10px] text-slate-400 italic">Sem dados</span>}
                </div>
            </div>
        </div>
    );
};
