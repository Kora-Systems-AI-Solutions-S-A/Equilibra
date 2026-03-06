import { DebtPriority } from '@/models/debtPlan.model';

export interface DebtPlanDto {
  id: string;
  nome: string;
  valor_total: number;
  valor_mensal: number;
  prioridade: DebtPriority;
  data_inicio: string;
  data_termino?: string;
  parcelas_total: number;
  parcelas_pagas: number;
}

export interface CreateDebtPlanRequest {
  nome: string;
  valorTotal: number;
  valorMensal: number;
  prioridade: DebtPriority;
  dataInicio: string;
  parcelasTotal: number;
}

export interface RegisterPaymentRequest {
  quantity: number;
}
