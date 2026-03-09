export interface InvestmentPlan {
  id: string;
  userId: string;
  nome: string;
  tipo: string;
  valorAtual: number;
  contribuicaoMensal?: number;
  objetivo?: string;
  instituicao?: string;
  status: "Ativo" | "Pausado" | "Concluido";
  dataInicio?: string;
  observacoes?: string;
  icone: string;
  cor: string;
}
