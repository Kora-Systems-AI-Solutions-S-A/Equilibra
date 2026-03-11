import { MonthlyRecord, MonthlyRecordType, MonthlyRecordStatus } from '@/models/monthlyRecord.model';
import { MonthlyRecordDto, CreateMonthlyRecordRequest } from '@/mappers/monthlyRecords.dto';

export const monthlyRecordMapper = {
  toDomain: (dto: MonthlyRecordDto): MonthlyRecord => ({
    id: dto.id,
    userId: dto.user_id,
    tipo: dto.type as MonthlyRecordType,
    descricao: dto.description,
    origem: dto.origin || undefined,
    categoria: dto.category || undefined,
    valor: dto.amount,
    status: dto.status as MonthlyRecordStatus,
    data: dto.occurred_at,
    mesReferencia: dto.reference_month,
    observacoes: dto.observations || undefined,
  }),

  toDto: (model: MonthlyRecord): MonthlyRecordDto => ({
    id: model.id,
    user_id: model.userId,
    type: model.tipo,
    description: model.descricao,
    origin: model.origem || null,
    category: model.tipo === 'Receita' ? null : (model.categoria || null),
    amount: model.valor,
    status: model.status,
    occurred_at: model.data,
    reference_month: model.mesReferencia,
    observations: model.observacoes || null,
  }),

  toCreateRequest: (model: Partial<MonthlyRecord>): CreateMonthlyRecordRequest => ({
    type: model.tipo || 'Despesa',
    description: model.descricao || '',
    origin: model.origem || null,
    category: (model.tipo || 'Despesa') === 'Receita' ? null : (model.categoria || null),
    amount: model.valor || 0,
    status: model.status || 'Pendente',
    occurred_at: model.data || new Date().toISOString(),
    reference_month: model.mesReferencia || '',
    observations: model.observacoes || null,
  }),
};
