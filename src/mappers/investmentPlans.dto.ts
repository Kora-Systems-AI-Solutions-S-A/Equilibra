export interface InvestmentPlanDto {
  id: string;
  nome: string;
  tipo: string;
  valor_atual: number;
  contribuicao_mensal?: number;
  objetivo?: string;
  instituicao?: string;
  status: "Ativo" | "Pausado" | "Concluido";
  data_inicio?: string;
  observacoes?: string;
  icone: string;
  cor: string;
}

export interface CreateInvestmentPlanRequest {
  nome: string;
  tipo: string;
  valor_atual: number;
  data_inicio?: string;
}

export interface UpdateInvestmentPlanRequest {
  nome?: string;
  tipo?: string;
  valor_atual?: number;
  data_inicio?: string;
}

export interface InvestmentContributionRequest {
  amount: number;
  date: string;
  note?: string;
}
