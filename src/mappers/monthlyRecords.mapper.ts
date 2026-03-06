import { MonthlyRecord } from '@/models/monthlyRecord.model';
import { MonthlyRecordDto, CreateMonthlyRecordRequest } from './monthlyRecords.dto';

export const monthlyRecordMapper = {
  toDomain: (dto: MonthlyRecordDto): MonthlyRecord => ({
    id: dto.id,
    tipo: dto.tipo,
    descricao: dto.descricao,
    origem: dto.origem,
    categoria: dto.categoria,
    valor: dto.valor,
    status: dto.status,
    data: dto.data,
    mesReferencia: dto.mes_referencia,
    observacoes: dto.observacoes,
  }),

  toDto: (model: MonthlyRecord): MonthlyRecordDto => ({
    id: model.id,
    tipo: model.tipo,
    descricao: model.descricao,
    origem: model.origem,
    categoria: model.categoria,
    valor: model.valor,
    status: model.status,
    data: model.data,
    mes_referencia: model.mesReferencia,
    observacoes: model.observacoes,
  }),

  toCreateRequest: (model: Partial<MonthlyRecord>): CreateMonthlyRecordRequest => ({
    tipo: model.tipo || 'Despesa',
    descricao: model.descricao || '',
    origem: model.origem,
    categoria: model.categoria,
    valor: model.valor || 0,
    status: model.status || 'Pendente',
    data: model.data || new Date().toISOString(),
    mesReferencia: model.mesReferencia || '',
    observacoes: model.observacoes,
  }),
};
