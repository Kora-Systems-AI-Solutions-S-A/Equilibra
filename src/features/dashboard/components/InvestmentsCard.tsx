import React from 'react';
import { ArrowUpRight, Globe, Landmark, Building2, Plus, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Investment } from '../types';
import { Tooltip } from '@/components/ui/Tooltip';

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Landmark,
  Building2,
};

interface InvestmentsCardProps {
  investments: Investment[];
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-10 relative overflow-visible flex flex-col min-h-[288px]">
      <div className="p-6 md:p-8 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Planos de Investimento</h2>
          </div>
          <p className="text-sm text-slate-500">Acompanhe e reforce seus objetivos financeiros.</p>
        </div>
        <button 
          onClick={onExpandInvestment}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowUpRight size={24} />
        </button>
      </div>
      <div className="px-4 md:px-8 pb-20 md:pb-20 flex flex-col gap-4 flex-1">
        {investments.map((item) => {
          const Icon = iconMap[item.icon] || Globe;
          return (
            <div key={item.id} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">{formatCurrency(item.totalValue)}</p>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => onReinforceInvestment(item.id)}
                className="px-6 py-2 text-xs font-bold uppercase"
              >
                Reforçar
              </Button>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 right-6">
        <Tooltip content="Criar novo investimento">
          <button 
            onClick={onCreateNewInvestment}
            className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <Plus size={20} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
