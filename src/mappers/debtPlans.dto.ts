import { DebtPriority } from '@/models/debtPlan.model';

export interface DebtPlanDto {
  id: string;
  user_id: string;
  name: string;
  total_amount: number;
  remaining_amount: number;
  monthly_payment: number;
  interest_rate: number;
  priority: string;
  start_date: string;
  end_date?: string | null;
  total_installments: number;
  paid_installments: number;
}

export interface CreateDebtPlanRequest {
  name: string;
  total_amount: number;
  remaining_amount: number;
  monthly_payment: number;
  interest_rate?: number;
  priority: DebtPriority;
  start_date: string;
  end_date?: string;
  total_installments: number;
}

export interface RegisterPaymentRequest {
  quantity: number;
}
