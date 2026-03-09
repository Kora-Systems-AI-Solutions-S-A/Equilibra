import { DebtPlan } from '@/models/debtPlan.model';

export const calculateValorRestante = (plan: DebtPlan): number => {
  return Math.max(0, plan.valorTotal - plan.parcelasPagas * plan.valorMensal);
};

export const calculateProgressPercent = (plan: DebtPlan): number => {
  if (plan.parcelasTotal === 0) return 0;
  const percent = (plan.parcelasPagas / plan.parcelasTotal) * 100;
  return Number(percent.toFixed(1));
};

const priorityWeight = {
  'Alta': 3,
  'Média': 2,
  'Baixa': 1
};

export const sortPlansForDashboard = (plans: DebtPlan[]) => {
  return [...plans].sort((a, b) => {
    const aProgress = calculateProgressPercent(a);
    const bProgress = calculateProgressPercent(b);
    const aConcluded = aProgress === 100;
    const bConcluded = bProgress === 100;

    if (aConcluded !== bConcluded) {
      return aConcluded ? 1 : -1;
    }

    return priorityWeight[b.prioridade] - priorityWeight[a.prioridade];
  });
};
