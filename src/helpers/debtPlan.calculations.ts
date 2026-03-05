import { DebtPlan } from '../models/debtPlan.model';

export const calculateValorRestante = (plan: DebtPlan): number => {
  return Math.max(0, plan.valorTotal - plan.parcelasPagas * plan.valorMensal);
};

export const calculateProgressPercent = (plan: DebtPlan): number => {
  if (plan.parcelasTotal === 0) return 0;
  const percent = (plan.parcelasPagas / plan.parcelasTotal) * 100;
  return Number(percent.toFixed(1));
};
