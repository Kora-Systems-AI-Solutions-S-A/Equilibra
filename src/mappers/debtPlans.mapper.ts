import { DebtPlan } from '../models/debtPlan.model';
import { DebtPlanDto, CreateDebtPlanRequest } from './debtPlans.dto';

export const debtPlanMapper = {
  toDomain: (dto: DebtPlanDto): DebtPlan => ({
    id: dto.id,
    nome: dto.nome,
    valorTotal: dto.valor_total,
    valorMensal: dto.valor_mensal,
    prioridade: dto.prioridade,
    dataInicio: dto.data_inicio,
    dataTermino: dto.data_termino,
    parcelasTotal: dto.parcelas_total,
    parcelasPagas: dto.parcelas_pagas,
  }),

  toCreateRequest: (plan: Partial<DebtPlan>): CreateDebtPlanRequest => ({
    nome: plan.nome || '',
    valorTotal: plan.valorTotal || 0,
    valorMensal: plan.valorMensal || 0,
    prioridade: plan.prioridade || ('' as any),
    dataInicio: plan.dataInicio || new Date().toISOString(),
    parcelasTotal: plan.parcelasTotal || 0,
  }),
};
