export enum DebtPriority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
}

export interface DebtPlan {
  id: string;
  nome: string;
  valorTotal: number;
  valorMensal: number;
  prioridade: DebtPriority;
  dataInicio: string; // ISO
  dataTermino?: string; // ISO
  parcelasTotal: number;
  parcelasPagas: number;
}
