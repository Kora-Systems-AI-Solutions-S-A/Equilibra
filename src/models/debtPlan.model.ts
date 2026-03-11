export enum DebtPriority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
}

export interface DebtPlan {
  id: string;
  userId: string;
  nome: string;
  valorTotal: number;
  remainingAmount: number;
  valorMensal: number;
  interestRate: number;
  prioridade: DebtPriority;
  dataInicio: string; // ISO
  dataTermino?: string; // ISO
  parcelasTotal: number;
  parcelasPagas: number;
}
