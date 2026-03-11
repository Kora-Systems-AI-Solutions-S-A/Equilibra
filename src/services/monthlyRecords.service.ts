import { MonthlyRecord, MonthlyRecordStatus } from '@/models/monthlyRecord.model';
import { CreateMonthlyRecordRequest, UpdateMonthlyRecordRequest, MonthlyRecordDto } from '@/mappers/monthlyRecords.dto';
import { monthlyRecordMapper } from '@/mappers/monthlyRecords.mapper';
import { supabase } from '@/core/supabase/client';
import { Database } from '@/core/supabase/database.types';

type MonthlyRecordInsert = Database['public']['Tables']['monthly_records']['Insert'];
type MonthlyRecordUpdate = Database['public']['Tables']['monthly_records']['Update'];

export const MonthlyRecordsService = {
  // Lista registros do usuário, opcionalmente filtrados por mês (MM/YYYY)
  async listMonthlyRecords(userId: string, monthRef?: string): Promise<MonthlyRecord[]> {
    if (!userId) return [];

    let query = supabase
      .from('monthly_records')
      .select('*')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false });

    if (monthRef) {
      query = query.eq('reference_month', monthRef);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar registros: ${error.message}`);
    }

    return (data || []).map(row => monthlyRecordMapper.toDomain(row as MonthlyRecordDto));
  },

  // Busca um registro específico pelo ID
  async getMonthlyRecordById(userId: string, id: string): Promise<MonthlyRecord> {
    const { data, error } = await supabase
      .from('monthly_records')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new Error('Registro não encontrado');
    }

    return monthlyRecordMapper.toDomain(data as MonthlyRecordDto);
  },

  // Cria um novo registro
  async createMonthlyRecord(userId: string, payload: CreateMonthlyRecordRequest): Promise<MonthlyRecord> {
    if (!userId) throw new Error('Utilizador não autenticado');

    const insertPayload: MonthlyRecordInsert = {
      ...payload,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('monthly_records')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao criar registro: ${error.message}`);
    }

    return monthlyRecordMapper.toDomain(data as MonthlyRecordDto);
  },

  // Atualiza um registro existente
  async updateMonthlyRecord(userId: string, id: string, payload: UpdateMonthlyRecordRequest): Promise<MonthlyRecord> {
    const updatePayload: MonthlyRecordUpdate = {
      ...payload,
    };

    const { data, error } = await supabase
      .from('monthly_records')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao atualizar registro: ${error.message}`);
    }

    return monthlyRecordMapper.toDomain(data as MonthlyRecordDto);
  },

  // Atualiza apenas o status de um registro
  async updateMonthlyRecordStatus(userId: string, id: string, status: MonthlyRecordStatus): Promise<MonthlyRecord> {
    const updatePayload: MonthlyRecordUpdate = {
      status,
    };

    const { data, error } = await supabase
      .from('monthly_records')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new Error('Registro não encontrado ou erro ao atualizar status');
    }

    return monthlyRecordMapper.toDomain(data as MonthlyRecordDto);
  },

  // Marca um registro como cancelado
  async cancelMonthlyRecord(userId: string, id: string): Promise<MonthlyRecord> {
    return this.updateMonthlyRecordStatus(userId, id, 'Cancelado');
  },
};
