export interface InvestmentPlan {
  id: string;
  userId: string;
  nome: string;
  tipo: string;
  valorAtual: number; // Calculated front-end field (initial_amount + sum(contributions))
  valorInicial: number;
  objetivo: number;
  instituicao?: string;
  status: "Ativo" | "Pausado" | "Concluido";
  dataInicio: string;
  icone: string;
  cor: string;
}

export interface InvestmentContribution {
  id: string;
  investmentId: string;
  valor: number; // amount
  data: string;  // occurred_at
  observacoes?: string; // notes
  createdAt: string;
}
