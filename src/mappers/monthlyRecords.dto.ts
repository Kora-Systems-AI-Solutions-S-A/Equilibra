import { MonthlyRecordType, MonthlyRecordStatus } from '@/models/monthlyRecord.model';

// Este DTO agora reflete exatamente a estrutura da tabela 'monthly_records' (Row type)
export interface MonthlyRecordDto {
  id: string;
  user_id: string;
  type: string; // no DB é varchar
  description: string;
  origin: string | null;
  category: string | null;
  amount: number;
  status: string; // no DB é varchar
  occurred_at: string; // timestamptz
  reference_month: string;
  observations: string | null;
  created_at?: string;
  updated_at?: string | null;
}

// Representa a chamada Insert do Supabase
export interface CreateMonthlyRecordRequest {
  type: MonthlyRecordType;
  description: string;
  origin?: string | null;
  category?: string | null;
  amount: number;
  status: MonthlyRecordStatus;
  occurred_at: string;
  reference_month: string;
  observations?: string | null;
}

// Representa a chamada Update do Supabase
export interface UpdateMonthlyRecordRequest {
  type?: MonthlyRecordType;
  description?: string;
  origin?: string | null;
  category?: string | null;
  amount?: number;
  status?: MonthlyRecordStatus;
  occurred_at?: string;
  reference_month?: string;
  observations?: string | null;
}

export interface UpdateMonthlyRecordStatusRequest {
  status: MonthlyRecordStatus;
}
