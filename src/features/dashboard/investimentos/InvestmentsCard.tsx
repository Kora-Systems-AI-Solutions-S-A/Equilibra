import React from 'react';
import { ArrowUpRight, Globe, Landmark, Building2, Plus, LucideIcon } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { InvestmentPlan } from '@/models/investmentPlan.model';
import { Tooltip } from '@/shared/ui/Tooltip';

const iconMap: Record<string, LucideIcon> = {
    Globe,
    Landmark,
    Building2,
};

interface InvestmentsCardProps {
    investments: InvestmentPlan[];
    onExpandInvestment: () => void;
    onReinforceInvestment: (id: string) => void;
    onCreateNewInvestment: () => void;
}

export const InvestmentsCard: React.FC<InvestmentsCardProps> = ({
    investments,
    onExpandInvestment,
    onReinforceInvestment,
    onCreateNewInvestment,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-10 relative overflow-visible flex flex-col min-h-[288px] pb-20 md:pb-20">
            <div className="p-6 md:p-8 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-slate-900">Planos de Investimento</h2>
                    <p className="text-sm text-slate-500">Acompanhe e reforce seus objetivos financeiros.</p>
                </div>
                <button
                    onClick={onExpandInvestment}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <ArrowUpRight size={24} />
                </button>
            </div>
            <div className="px-6 md:px-8 flex flex-col gap-4 flex-1">
                {investments.map((item) => {
                    const Icon = iconMap[item.icone] || Globe;
                    return (
                        <div key={item.id} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${item.cor} rounded-xl flex items-center justify-center`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">{item.nome}</h4>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">{formatCurrency(item.valorAtual)}</p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => onReinforceInvestment(item.id)}
                            >
                                Reforçar
                            </Button>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-5 right-4">
                <Tooltip content="Criar novo investimento">
                    <button
                        onClick={onCreateNewInvestment}
                        className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                        <Plus size={24} />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};
