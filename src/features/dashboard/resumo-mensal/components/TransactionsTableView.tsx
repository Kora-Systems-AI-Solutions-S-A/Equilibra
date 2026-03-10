import { formatCurrency, formatDate } from '@/lib/utils';
import { RowActionsMenu, ActionItem } from '@/shared/ui/RowActionsMenu';
import { MonthlyRecord } from '@/models/monthlyRecord.model';

interface TransactionsTableViewProps {
    records: MonthlyRecord[];
    getRecordActions: (record: MonthlyRecord) => ActionItem[];
}

export const TransactionsTableView = ({ records, getRecordActions }: TransactionsTableViewProps) => {
    return (
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
                    {records.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-4 text-sm font-medium">{formatDate(t.data)}</td>
                            <td className="px-8 py-4 text-sm font-semibold">{t.descricao}</td>
                            <td className="px-8 py-4">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium truncate max-w-[120px] inline-block">
                                    {t.tipo === 'Receita' ? 'Receita' : (t.categoria || 'Geral')}
                                </span>
                            </td>
                            <td className="px-8 py-4 text-sm font-bold text-slate-900">{formatCurrency(t.valor)}</td>
                            <td className="px-8 py-4 text-right">
                                <RowActionsMenu actions={getRecordActions(t)} />
                            </td>
                        </tr>
                    ))}
                    {records.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-8 py-6 text-center text-sm text-slate-400">
                                Nenhuma transação encontrada neste período.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Mobile List View */}
            <div className="sm:hidden divide-y divide-slate-50">
                {records.map((t) => (
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
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-medium uppercase truncate max-w-[100px]">
                                    {t.tipo === 'Receita' ? 'Receita' : (t.categoria || 'Geral')}
                                </span>
                            </div>
                            <RowActionsMenu actions={getRecordActions(t)} />
                        </div>
                    </div>
                ))}
                {records.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">
                        Nenhuma transação encontrada.
                    </div>
                )}
            </div>
        </div>
    );
};
