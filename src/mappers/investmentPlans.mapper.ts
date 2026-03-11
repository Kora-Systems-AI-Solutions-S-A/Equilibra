import { InvestmentPlan, InvestmentContribution } from '@/models/investmentPlan.model';
import { InvestmentPlanDto, CreateInvestmentPlanRequest, InvestmentContributionDto, CreateInvestmentContributionRequest } from '@/mappers/investmentPlans.dto';

export const investmentPlanMapper = {
  toDomain: (dto: InvestmentPlanDto): InvestmentPlan => ({
    id: dto.id,
    userId: dto.user_id,
    nome: dto.name,
    tipo: dto.type,
    valorAtual: dto.initial_amount, // Base value, will be updated by service if there are contributions
    valorInicial: dto.initial_amount,
    objetivo: dto.target_amount,
    instituicao: dto.institution || undefined,
    status: dto.status as "Ativo" | "Pausado" | "Concluido",
    dataInicio: dto.start_date,
    icone: dto.icon,
    cor: dto.color,
  }),

  toCreateRequest: (plan: Partial<InvestmentPlan>): CreateInvestmentPlanRequest => ({
    name: plan.nome || '',
    type: plan.tipo || '',
    target_amount: plan.objetivo || 0,
    initial_amount: plan.valorInicial || 0,
    institution: plan.instituicao,
    status: plan.status || 'Ativo',
    start_date: plan.dataInicio || new Date().toISOString(),
    icon: plan.icone || 'Globe',
    color: plan.cor || 'bg-blue-100 text-blue-600',
  }),

  contributionToDomain: (dto: InvestmentContributionDto): InvestmentContribution => ({
    id: dto.id,
    investmentId: dto.investment_id,
    valor: dto.amount,
    data: dto.occurred_at,
    observacoes: dto.notes || undefined,
    createdAt: dto.created_at,
  }),

  contributionToCreateRequest: (amount: number, date: string, note?: string): CreateInvestmentContributionRequest => ({
    amount,
    occurred_at: date,
    notes: note,
  }),
};
