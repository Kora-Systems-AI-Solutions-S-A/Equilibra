import React from 'react';
import { ArrowUpRight, Globe, Landmark, Building2, Plus, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Investment } from '../types';

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-10">
      <div className="p-8 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Planos de Investimento</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 text-[10px] font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={onCreateNewInvestment}
            >
              <Plus size={14} className="mr-1" />
              NOVO INVESTIMENTO
            </Button>
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
      <div className="px-8 pb-8 flex flex-col gap-4">
        {investments.map((item) => {
          const Icon = iconMap[item.icon] || Globe;
          return (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
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
    </div>
  );
};
