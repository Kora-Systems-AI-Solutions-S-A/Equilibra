import { useMonthlyRecordsStore } from '@/store/monthlyRecords.store';
import {
    getTotalIncomeInMonth,
    getTotalActiveExpensesInMonth,
    getExpenseCategoryChartData,
    getIncomeExpenseTrendChartData,
    getIncomeVsExpenseChartData,
    getCashFlowChartData
} from '@/helpers/monthlyRecords.calculations';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowUpRight, LayoutGrid, CheckCircle2, XCircle, Edit2 } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { RowActionsMenu, ActionItem } from '@/shared/ui/RowActionsMenu';

export const MonthlySummaryCard = () => {
    const {
        items,
        allRecords,
        selectedMonth,
        markAsPaid,
        markAsReceived,
        cancelRecord,
        setSelectedRecord
    } = useMonthlyRecordsStore();
    const { openExpandedModal, dashboardFilters, openRegisterModal } = useUIStore();

    const {
        totalIncome,
        totalExpense,
        total,
        saldo,
        incomePercent,
        expensePercent
    } = getCashFlowChartData(items);

    const categoryData = getExpenseCategoryChartData(items);
    const trendData = getIncomeExpenseTrendChartData(allRecords, selectedMonth);

    const formatK = (val: number) => {
        if (Math.abs(val) >= 1000) return `€ ${(val / 1000).toFixed(1)}k`.replace('.', ',');
        return formatCurrency(val);
    };

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

    const filteredRecords = items.filter(t => {
        if (t.status === 'Cancelado') return false;
        const typeMap = { 'income': 'Receita', 'expense': 'Despesa' };
        const mappedTypes = dashboardFilters.types.map(type => typeMap[type as keyof typeof typeMap]);
        if (!mappedTypes.includes(t.tipo)) return false;
        return true;
    });

    const displayedRecords = filteredRecords.slice(0, 2);

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
                {/* Rendimentos vs Despesas */}
                <div className="flex items-center gap-4">
                    <div className="relative w-[100px] h-[100px] shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#e2e8f0" strokeWidth="3.5"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#22C55E" strokeDasharray={`${incomePercent}, 100`} strokeLinecap="round" strokeWidth="3.5"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#EF4444" strokeDasharray={`${expensePercent}, 100`} strokeDashoffset={`-${incomePercent}`} strokeLinecap="round" strokeWidth="3.5"></circle>
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
                                <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                                <span className="text-[11px] font-medium text-slate-600">Rendimentos ({incomePercent.toFixed(0)}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                                <span className="text-[11px] font-medium text-slate-600">Despesas ({expensePercent.toFixed(0)}%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Despesas por Categoria */}
                <div className="flex items-center gap-4">
                    <div className="relative w-[100px] h-[100px] shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#e2e8f0" strokeWidth="3.5"></circle>
                            {categoryData.length > 0 ? (
                                categoryData.slice(0, 3).map((cat, i, arr) => {
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
                                            strokeLinecap="round" strokeWidth="3.5"
                                        ></circle>
                                    );
                                })
                            ) : (
                                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#e2e8f0" strokeWidth="3.5"></circle>
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
                                const colors = ['bg-[#3b82f6]', 'bg-[#f59e0b]', 'bg-[#8b5cf6]'];
                                return (
                                    <div key={cat.name} className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`}></div>
                                        <span className="text-[10px] font-medium text-slate-600">{cat.name}</span>
                                    </div>
                                );
                            })}
                            {categoryData.length === 0 && <span className="text-[10px] text-slate-400 italic">Sem dados</span>}
                        </div>
                    </div>
                </div>

                {/* Tendência Financeira */}
                <div className="flex flex-col justify-center">
                    <div className="flex flex-col gap-0.5 mb-3">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tendência Financeira</h4>
                        <p className="text-[10px] text-slate-400">Últimos 6 meses</p>
                    </div>
                    <div className="w-full h-14 relative group">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 60">
                            {/* Linha de Receitas (Verde) */}
                            <path d={incomePath} fill="none" stroke="#22C55E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            {/* Linha de Despesas (Vermelha) */}
                            <path d={expensePath} fill="none" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>

                            {trendData.map((d, i) => {
                                const x = (i / (trendData.length - 1)) * 200;
                                const allValues = trendData.flatMap(v => [v.income, v.expense]);
                                const maxVal = Math.max(...allValues, 1);
                                const yIncome = 60 - (d.income / maxVal) * 50 - 5;
                                const yExpense = 60 - (d.expense / maxVal) * 50 - 5;
                                return (
                                    <g key={i}>
                                        <circle cx={x} cy={yIncome} fill="white" r="2" stroke="#22C55E" strokeWidth="1"></circle>
                                        <circle cx={x} cy={yExpense} fill="white" r="2" stroke="#EF4444" strokeWidth="1"></circle>
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
            </div>

            <div className="overflow-x-auto">
                {/* Desktop Table View */}
                <table className="w-full text-left hidden sm:table">
                    <thead>
                        <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                            <th className="px-8 py-3">Data</th>
                            <th className="px-8 py-3">Descrição</th>
                            <th className="px-8 py-3">Categoria</th>
                            <th className="px-8 py-3">Valor</th>
                            <th className="px-8 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {displayedRecords.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-4 text-sm font-medium">{formatDate(t.data)}</td>
                                <td className="px-8 py-4 text-sm font-semibold">{t.descricao}</td>
                                <td className="px-8 py-4">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
                                        {t.tipo === 'Receita' ? 'Receita' : (t.categoria || 'Geral')}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-sm font-bold text-slate-900">{formatCurrency(t.valor)}</td>
                                <td className="px-8 py-4 text-right">
                                    <RowActionsMenu actions={getRecordActions(t)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile List View */}
                <div className="sm:hidden divide-y divide-slate-50">
                    {displayedRecords.map((t) => (
                        <div key={t.id} className="px-4 py-4 flex flex-col gap-2 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-semibold text-slate-900">{t.descricao}</span>
                                <span className="text-sm font-bold text-slate-900">{formatCurrency(t.valor)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">
                                        {formatDate(t.data)}
                                    </span>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-medium uppercase">
                                        {t.tipo === 'Receita' ? 'Receita' : (t.categoria || 'Geral')}
                                    </span>
                                </div>
                                <RowActionsMenu actions={getRecordActions(t)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
