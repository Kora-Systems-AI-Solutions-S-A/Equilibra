import { MonthlyRecord, MonthlyRecordStatus } from '@/models/monthlyRecord.model';
import { CreateMonthlyRecordRequest, UpdateMonthlyRecordRequest } from '@/mappers/monthlyRecords.dto';
import { authService } from '@/services/auth.service';

// TEMP MOCK - remover quando integração com Supabase/API estiver pronta
let mockRecords: MonthlyRecord[] = [
  {
    id: '1',
    userId: '1',
    tipo: 'Receita',
    descricao: 'Salário Mensal',
    origem: 'Empresa Tech',
    valor: 4500.00,
    status: 'Recebido',
    data: '2023-10-05T00:00:00.000Z',
    mesReferencia: '10/2023',
  },
  {
    id: '2',
    userId: '1',
    tipo: 'Receita',
    descricao: 'Freelance UI Design',
    origem: 'Cliente Exterior',
    valor: 1200.00,
    status: 'Pendente',
    data: '2023-10-20T00:00:00.000Z',
    mesReferencia: '10/2023',
  },
  {
    id: '3',
    userId: '1',
    tipo: 'Despesa',
    descricao: 'Aluguel Residencial',
    categoria: 'Habitação',
    valor: 2400.00,
    status: 'Pago',
    data: '2023-10-10T00:00:00.000Z',
    mesReferencia: '10/2023',
  },
  {
    id: '4',
    userId: '1',
    tipo: 'Despesa',
    descricao: 'Supermercado',
    categoria: 'Alimentação',
    valor: 850.00,
    status: 'Pendente',
    data: '2023-10-15T00:00:00.000Z',
    mesReferencia: '10/2023',
  },
  {
    id: '5',
    userId: '1',
    tipo: 'Despesa',
    descricao: 'Assinatura Streaming',
    categoria: 'Lazer',
    valor: 15.99,
    status: 'Cancelado',
    data: '2023-10-01T00:00:00.000Z',
    mesReferencia: '10/2023',
  },
  // Mês Atual (Simulado como Março 2026 baseado no contexto)
  {
    id: '6',
    userId: '1',
    tipo: 'Receita',
    descricao: 'Salário Mensal',
    origem: 'Empresa Tech',
    valor: 4500.00,
    status: 'Recebido',
    data: '2026-03-05T00:00:00.000Z',
    mesReferencia: '03/2026',
  },
  {
    id: '7',
    userId: '1',
    tipo: 'Despesa',
    descricao: 'Aluguel',
    categoria: 'Habitação',
    valor: 2500.00,
    status: 'Pago',
    data: '2026-03-10T00:00:00.000Z',
    mesReferencia: '03/2026',
  },
  {
    id: '8',
    userId: '1',
    tipo: 'Despesa',
    descricao: 'Energia Elétrica',
    categoria: 'Habitação',
    valor: 120.00,
    status: 'Pendente',
    data: '2026-03-15T00:00:00.000Z',
    mesReferencia: '03/2026',
  }
];

export const MonthlyRecordsService = {
  async listMonthlyRecords(monthRef?: string): Promise<MonthlyRecord[]> {
    const userId = authService.getCurrentUserId();
    if (!userId) return [];

    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = mockRecords.filter(r => r.userId === userId);
    
    if (monthRef) {
      filtered = filtered.filter(r => r.mesReferencia === monthRef);
    }
    
    return [...filtered];
  },

  async getMonthlyRecordById(id: string): Promise<MonthlyRecord> {
    const userId = authService.getCurrentUserId();
    const record = mockRecords.find(r => r.id === id && r.userId === userId);
    if (!record) throw new Error('Registro não encontrado');
    return { ...record };
  },

  async createMonthlyRecord(payload: CreateMonthlyRecordRequest): Promise<MonthlyRecord> {
    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Utilizador não autenticado');

    const newRecord: MonthlyRecord = {
      ...payload,
      id: Math.random().toString(36).substring(7),
      userId,
    };
    mockRecords = [newRecord, ...mockRecords];
    return newRecord;
  },

  async updateMonthlyRecord(id: string, payload: UpdateMonthlyRecordRequest): Promise<MonthlyRecord> {
    const userId = authService.getCurrentUserId();
    const index = mockRecords.findIndex(r => r.id === id && r.userId === userId);
    if (index === -1) throw new Error('Registro não encontrado');
    
    mockRecords[index] = { ...mockRecords[index], ...payload };
    return { ...mockRecords[index] };
  },

  async updateMonthlyRecordStatus(id: string, status: MonthlyRecordStatus): Promise<MonthlyRecord> {
    const userId = authService.getCurrentUserId();
    const index = mockRecords.findIndex(r => r.id === id && r.userId === userId);
    if (index === -1) throw new Error('Registro não encontrado');
    
    mockRecords[index] = { ...mockRecords[index], status };
    return { ...mockRecords[index] };
  },

  async cancelMonthlyRecord(id: string): Promise<MonthlyRecord> {
    return this.updateMonthlyRecordStatus(id, 'Cancelado');
  },
};
