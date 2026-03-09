import { MonthlyRecordType, MonthlyRecordStatus } from '@/models/monthlyRecord.model';

export interface MonthlyRecordDto {
  id: string;
  user_id: string;
  tipo: MonthlyRecordType;
  descricao: string;
  origem?: string;
  categoria?: string;
  valor: number;
  status: MonthlyRecordStatus;
  data: string;
  mes_referencia: string;
  observacoes?: string;
}

export interface CreateMonthlyRecordRequest {
  tipo: MonthlyRecordType;
  descricao: string;
  origem?: string;
  categoria?: string;
  valor: number;
  status: MonthlyRecordStatus;
  data: string;
  mesReferencia: string;
  observacoes?: string;
}

export interface UpdateMonthlyRecordRequest {
  tipo?: MonthlyRecordType;
  descricao?: string;
  origem?: string;
  categoria?: string;
  valor?: number;
  status?: MonthlyRecordStatus;
  data?: string;
  mesReferencia?: string;
  observacoes?: string;
}

export interface UpdateMonthlyRecordStatusRequest {
  status: MonthlyRecordStatus;
}
