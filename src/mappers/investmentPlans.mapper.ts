import { InvestmentPlan } from '@/models/investmentPlan.model';
import { InvestmentPlanDto } from './investmentPlans.dto';

export const mapInvestmentPlanToModel = (dto: InvestmentPlanDto): InvestmentPlan => {
  return {
    id: dto.id,
    nome: dto.nome,
    tipo: dto.tipo,
    valorAtual: dto.valor_atual,
    contribuicaoMensal: dto.contribuicao_mensal,
    objetivo: dto.objetivo,
    instituicao: dto.instituicao,
    status: dto.status,
    dataInicio: dto.data_inicio,
    observacoes: dto.observacoes,
    icone: dto.icone,
    cor: dto.cor,
  };
};

export const mapInvestmentPlanToDto = (model: InvestmentPlan): InvestmentPlanDto => {
  return {
    id: model.id,
    nome: model.nome,
    tipo: model.tipo,
    valor_atual: model.valorAtual,
    contribuicao_mensal: model.contribuicaoMensal,
    objetivo: model.objetivo,
    instituicao: model.instituicao,
    status: model.status,
    data_inicio: model.dataInicio,
    observacoes: model.observacoes,
    icone: model.icone,
    cor: model.cor,
  };
};
