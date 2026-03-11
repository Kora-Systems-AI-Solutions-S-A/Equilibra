import { DebtPlan, DebtPriority } from '@/models/debtPlan.model';
import { DebtPlanDto, CreateDebtPlanRequest, UpdateDebtPlanRequest } from '@/mappers/debtPlans.dto';

export const debtPlanMapper = {
  toDomain: (dto: DebtPlanDto): DebtPlan => ({
    id: dto.id,
    userId: dto.user_id,
    nome: dto.name,
    valorTotal: dto.total_amount,
    remainingAmount: dto.remaining_amount,
    valorMensal: dto.monthly_payment,
    interestRate: dto.interest_rate,
    prioridade: dto.priority as DebtPriority,
    dataInicio: dto.start_date,
    dataTermino: dto.end_date,
    parcelasTotal: dto.total_installments,
    parcelasPagas: dto.paid_installments,
  }),

  toCreateRequest: (plan: Partial<DebtPlan>): CreateDebtPlanRequest => ({
    name: plan.nome || '',
    total_amount: plan.valorTotal || 0,
    remaining_amount: plan.remainingAmount || plan.valorTotal || 0,
    monthly_payment: plan.valorMensal || 0,
    interest_rate: plan.interestRate || 0,
    priority: plan.prioridade || ('' as any),
    start_date: plan.dataInicio || new Date().toISOString(),
    total_installments: plan.parcelasTotal || 0,
  }),

  toUpdateRequest: (updates: Partial<DebtPlan>): UpdateDebtPlanRequest => ({
    name: updates.nome,
    total_amount: updates.valorTotal,
    remaining_amount: updates.remainingAmount,
    monthly_payment: updates.valorMensal,
    interest_rate: updates.interestRate,
    priority: updates.prioridade,
    start_date: updates.dataInicio,
    end_date: updates.dataTermino,
    total_installments: updates.parcelasTotal,
    paid_installments: updates.parcelasPagas,
  }),
};
