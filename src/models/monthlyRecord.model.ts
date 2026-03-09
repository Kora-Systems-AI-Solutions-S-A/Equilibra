export type MonthlyRecordType = 'Receita' | 'Despesa';

export type MonthlyRecordStatus = 'Recebido' | 'Pago' | 'Pendente' | 'Cancelado';

export interface MonthlyRecord {
  id: string;
  userId: string;
  tipo: MonthlyRecordType;
  descricao: string;
  origem?: string;
  categoria?: string;
  valor: number;
  status: MonthlyRecordStatus;
  data: string; // ISO
  mesReferencia: string; // MM/YYYY
  observacoes?: string;
}
